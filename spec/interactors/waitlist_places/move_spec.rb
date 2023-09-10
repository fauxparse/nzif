require 'rails_helper'

RSpec.describe Waitlists::Move do
  let(:session) { create(:session, :with_workshop) }
  let(:waitlist) { create_list(:waitlist, 10, session:) }
  let(:context) { { session:, registration:, position: } }

  context 'when the user is on the waitlist' do
    let(:registration) { waitlist.first.registration }
    let(:position) { 10 }

    it { is_expected.to be_success }

    it 'moves the user to the correct position' do
      expect { result }
        .to change { session.waitlist.reload.map(&:registration_id) }
        .to waitlist.map(&:registration_id).rotate(1)
    end
  end

  context 'when the user is not on the waitlist' do
    let(:registration) { create(:registration, festival: session.festival) }
    let(:position) { 10 }

    it 'raises an error' do
      expect { result }.to raise_error(Waitlists::Move::NotOnWaitlist)
    end
  end
end
