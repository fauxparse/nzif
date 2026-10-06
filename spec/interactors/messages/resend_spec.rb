require 'rails_helper'

RSpec.describe Messages::Resend do
  let(:session) { create(:session, :with_workshop, :with_participants) }
  let(:context) do
    { current_user:, message: }
  end
  let(:tutor) { session.activity.tutors.includes(:profile).first.profile }
  let(:message) { create(:message, messageable: session, sender: current_user) }

  context 'when the current user is an admin' do
    it 'sends the message to the current participants' do
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

    it 'does not create a new message' do
      message
      expect { result }.not_to change(session.messages, :count)
    end

    it 'does not change the sender' do
      expect { result }.not_to change { message.reload.sender }
    end
  end

  context 'when the current user is the workshop tutor' do
    let(:current_user) { create(:user, profile: tutor) }

    it 'sends the message to the workshop participants' do
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
  end

  context 'when the current user is a workshop participant' do
    let(:current_user) { session.placements.first.registration.user }

    it 'raises an error' do
      expect { result }.to raise_error(ActionPolicy::Unauthorized)
    end
  end

  context 'when the session has no participants' do
    let(:session) { create(:session, :with_workshop) }
    let(:current_user) { create(:user) }

    it 'raises an error' do
      expect { result }.to raise_error(ActionPolicy::Unauthorized)
    end
  end

  context 'when the message has already been sent' do
    before do
      Messages::Send.call(
        current_user:,
        message:,
      )

      create(:placement, session:)
    end

    it 'sends the message to all current participants, including previous recipients' do
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
  end
end
