require 'rails_helper'

RSpec.describe Registrations::AddToSession, type: :interactor do
  let(:festival) { create(:festival, :with_workshops) }
  let(:session) { festival.sessions.first }
  let(:registration) { create(:registration, festival:) }
  let(:current_user) { registration.user }
  let(:context) { { session:, registration: } }
  let(:now) { festival.general_opens_at + 1.day }

  before do
    travel_to(now)
    allow(ParticipantMailer).to receive(:added).and_call_original
  end

  it 'adds the registration to the session' do
    expect { result }.to change(session.placements, :count).by(1)
  end

  it 'sends a notification email' do
    result
    expect(ParticipantMailer)
      .to have_received(:added)
      .with(registration:, session:, removed: [])
  end

  context 'when the session has existing messages' do
    let!(:message) { create(:message, messageable: session) }

    it 'sends the message to the new user' do
      expect { result }.to have_enqueued_job.with(
        'SessionMailer',
        'custom',
        'deliver_now',
        args: [hash_including(
          message:,
          recipients: [registration.user],
        )],
      )
    end
  end

  context 'when the user is on the waitlist' do
    before do
      session.waitlist.create!(registration:)
    end

    it 'removes the registration from the waitlist' do
      expect { result }
        .to change { session.waitlist.exists?(registration_id: registration.id) }
        .from(true).to(false)
    end
  end

  context 'when the registration is already in the session' do
    before do
      create(:placement, session:, registration:)
    end

    it 'does not add the registration to the session' do
      expect { result }.not_to change(session.placements, :count)
    end
  end

  context 'when the user isn’t authorized' do
    let(:current_user) { create(:user) }

    it 'fails' do
      expect { result }.to raise_error(ActionPolicy::Unauthorized)
    end
  end

  context 'when the user is moved from another session' do
    before do
      create(:placement, session: festival.sessions.second, registration:)
    end

    it 'removes the registration from the other session' do
      expect { result }.to change(festival.sessions.second.placements, :count).by(-1)
    end

    it 'sends a notification email' do
      result
      expect(ParticipantMailer)
        .to have_received(:added)
        .with(registration:, session:, removed: [festival.sessions.second.id])
    end
  end

  context 'when registration is not open yet' do
    let(:now) { festival.general_opens_at - 1.day }

    it 'does not send an email' do
      result
      expect(ParticipantMailer).not_to have_received(:added)
    end
  end
end
