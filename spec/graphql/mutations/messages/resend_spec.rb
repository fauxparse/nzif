require 'rails_helper'

RSpec.describe Mutations::Messages::Resend, type: :mutation do
  let(:query) do
    <<~GRAPHQL.squish
      mutation ResendMessage($id: ID!) {
        resendMessage(id: $id) {
          message {
            id
            subject
            sender {
              id
            }
          }
        }
      }
    GRAPHQL
  end

  let(:session) { create(:session, :with_workshop, :with_participants) }
  let(:sender) { create(:user) }
  let!(:message) { create(:message, messageable: session, sender:) }

  let(:variables) do
    {
      id: message.to_param,
    }
  end

  context 'when logged in as admin' do
    let(:current_user) { create(:admin) }

    it 'sends the message to all current participants' do
      expect { result }.to have_enqueued_job.with(
        'SessionMailer',
        'custom',
        'deliver_now',
        args: [hash_including(
          message:,
          recipients: session.message_recipients,
        )],
      )
    end

    it 'returns the original message' do
      expect(data[:resend_message][:message]).to include(
        id: message.to_param,
        subject: message.subject,
        sender: { id: sender.to_param },
      )
    end
  end

  context 'when logged in as a participant' do
    let(:current_user) { session.placements.first.registration.user }

    it 'raises an error' do
      expect { result }.to raise_error(ActionPolicy::Unauthorized)
    end
  end
end
