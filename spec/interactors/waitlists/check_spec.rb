require 'rails_helper'

RSpec.describe Waitlists::Check, type: :interactor do
  let(:festival) { create(:festival) }
  let(:session) { create(:session, festival:) }
  let(:registration) { create(:registration, festival:) }

  let(:context) { { session: } }

  context 'when the session has capacity' do
    before do
      create(:waitlist, session:, registration:)
    end

    let(:session) { create(:session, festival:, capacity: 1) }

    it 'promotes registrations from the waitlist' do
      expect { result }
        .to change(session.placements, :count).by(1)
        .and change(session.waitlist, :count).by(-1)
        .and change(registration.placements, :count).by(1)
        .and change(registration.waitlist, :count).by(-1)
    end

    context 'when it’s too close to the session start time' do
      before do
        travel_to(session.starts_at - 1.hour)
      end

      it 'does not promote registrations from the waitlist' do
        expect { result }.not_to change(session.placements, :count)
      end
    end
  end

  context 'when the session has no capacity' do
    let(:session) { create(:session, festival:, capacity: 1) }
    let(:existing_registration) { create(:registration, festival:) }

    before do
      create(:placement, session:, registration: existing_registration)
      create(:waitlist, session:, registration:)
    end

    it 'does not promote registrations from the waitlist' do
      expect { result }.not_to change(session.placements, :count)
    end

    it 'does not remove the hopeful participant from the waitlist' do
      expect { result }.not_to change(registration.waitlist, :count)
    end
  end

  context 'when the session has no waitlist' do
    let(:session) { create(:session, festival:, capacity: 1) }

    it 'does not promote registrations from the waitlist' do
      expect { result }.not_to change(session.placements, :count)
    end
  end
end
