require 'rails_helper'

RSpec.describe Messages::Send do
  let(:session) { create(:session, :with_workshop, :with_participants) }
  let(:context) do
    { current_user:, message: }
  end
  let(:tutor) { session.activity.tutors.includes(:profile).first.profile }
  let(:message) { create(:message, messageable: session, sender: current_user) }

  context 'when the current user is an admin' do
    it { is_expected.to be_success }

    it 'sends the message' do
      skip 'Flaky test'
      expect { result }.to have_enqueued_job.with(
        'SessionMailer',
        'custom',
        'deliver_now',
        args: [hash_including(
          message: have_attributes(id: message.id),
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

  context 'when sending again' do
    before do
      described_class.call(
        current_user:,
        message:,
      )

      create(:placement, session:)
    end

    it 'only sends the message to the new participants' do
      expect { result }.to have_enqueued_job.with(
        'SessionMailer',
        'custom',
        'deliver_now',
        args: [hash_including(
          message:,
          recipients: [User.last],
        )],
      )
    end
  end
end
