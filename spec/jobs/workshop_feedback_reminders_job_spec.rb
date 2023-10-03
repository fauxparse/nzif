require 'rails_helper'

RSpec.describe WorkshopFeedbackRemindersJob do
  let(:festival) do
    create(:festival, :with_workshops, :with_confirmed_registrations, workshop_days: 3)
  end

  context 'when a workshop slot has just finished' do
    let(:session) { festival.sessions.first }
    let(:sessions) { session.slot.sessions.includes(placements: { registration: :user }) }

    before do
      travel_to session.ends_at
    end

    it 'sends emails to all participants of those workshops' do
      allow(ParticipantMailer).to receive(:feedback_reminder).and_call_original

      described_class.perform_now

      sessions.each do |session|
        session.placements.each do |placement|
          expect(ParticipantMailer)
            .to have_received(:feedback_reminder)
            .with(session:, registration: placement.registration)
        end
      end
    end
  end
end
