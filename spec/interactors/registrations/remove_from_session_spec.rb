require 'rails_helper'

RSpec.describe Registrations::RemoveFromSession, type: :interactor do
  let(:festival) { create(:festival) }
  let(:session) { create(:session, festival:) }
  let(:registration) { create(:registration, festival:) }
  let(:current_user) { registration.user }
  let!(:placement) { create(:placement, session:, registration:) }
  let(:context) { { session:, registration:, promote: } }
  let(:promote) { false }
  let(:now) { festival.general_opens_at + 1.day }

  before do
    travel_to(now)
    allow(ParticipantMailer).to receive(:removed).and_call_original
  end

  it 'removes the registration from the session' do
    expect { result }.to change(session.placements, :count).by(-1)
  end

  it 'sends a notification email' do
    result
    expect(ParticipantMailer)
      .to have_received(:removed)
      .with(registration:, session:)
  end

  context 'when the registration is not in the session' do
    let(:placement) { nil }

    it 'does not remove the registration' do
      expect { result }.to raise_error(ActiveRecord::RecordNotFound)
    end
  end

  context 'when the user isn’t authorized' do
    let(:current_user) { create(:user) }

    it 'fails' do
      expect { result }.to raise_error(ActionPolicy::Unauthorized)
    end
  end

  context 'when there are people on the waitlist' do
    let(:session) { create(:session, festival:, capacity: 1) }
    let!(:waitlist) { create_list(:waitlist, 3, session:) }

    it 'leaves the session empty' do
      expect { result }.to change(session.placements, :count).from(1).to(0)
    end

    it 'does not promote from the waitlist unless asked to' do
      expect { result }.not_to change(session.waitlist, :count)
    end

    context 'and we want to promote the next person into the workshop' do
      let(:promote) { true }

      it 'promotes the next person into the workshop' do
        expect { result }.not_to change(session.placements, :count).from(1)
      end

      it 'promotes the correct person' do
        expect { result }
          .to change { session.placements.map(&:registration_id) }
          .from([placement.registration_id])
          .to([waitlist.first.registration_id])
      end

      it 'takes the person off the waitlist' do
        expect { result }.to change(session.waitlist, :count).from(3).to(2)
      end
    end
  end

  context 'when registration is not open yet' do
    let(:now) { festival.general_opens_at - 1.day }

    it 'does not send an email' do
      result
      expect(ParticipantMailer).not_to have_received(:removed)
    end
  end
end
