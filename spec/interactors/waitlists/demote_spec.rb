require 'rails_helper'

RSpec.describe Waitlists::Demote do
  let(:session) { create(:session, :with_workshop) }
  let(:placements) { create_list(:placement, 10, session:) }
  let(:waitlist) { create_list(:waitlist, 10, session:) }
  let(:context) { { session:, registration:, position: } }
  let(:registration) { placements.first.registration }
  let(:position) { 5 }

  context 'when the user is on the waitlist' do
    it { is_expected.to be_success }

    it 'moves the user to the correct position' do
      expect { result }
        .to change { session.waitlist.reload.map(&:registration_id) }
        .to [
          *waitlist[0...4].map(&:registration_id),
          registration.id,
          *waitlist[4..].map(&:registration_id),
        ]
    end
  end

  context 'when the user is not in the session' do
    let(:registration) { create(:registration, festival: session.festival) }
    let(:position) { 10 }

    it 'raises an error' do
      expect { result }.to raise_error(Waitlists::Demote::NotInSession)
    end
  end
end
