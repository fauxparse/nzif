require 'rails_helper'

RSpec.describe Messages::CreateAndSend do
  let(:session) { create(:session, :with_workshop, :with_participants) }
  let(:context) do
    { current_user:, messageable: session, subject: 'Test message', content: 'Hello' }
  end
  let(:tutor) { session.activity.tutors.includes(:profile).first.profile }

  context 'when the current user is an admin' do
    it { is_expected.to be_success }

    it 'creates a message' do
      expect { result }.to change(session.messages, :count).by(1)
    end

    it 'sends the message' do
      expect { result }.to have_enqueued_job.with(
        'SessionMailer',
        'custom',
        'deliver_now',
        args: [hash_including(
          message: an_instance_of(Message),
          recipients: session.participants.includes(:user).map(&:user),
        )],
      )
    end
  end

  context 'when the current user is the workshop tutor' do
    let(:current_user) { create(:user, profile: tutor) }

    it { is_expected.to be_success }

    it 'creates a message' do
      expect { result }.to change(session.messages, :count).by(1)
    end
  end

  context 'when the current user is a workshop participant' do
    let(:current_user) { session.placements.first.registration.user }

    it 'raises an error' do
      expect { result }.to raise_error(ActionPolicy::Unauthorized)
    end
  end
end
