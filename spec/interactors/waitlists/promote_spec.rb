require 'rails_helper'

RSpec.describe Waitlists::Promote do
  let(:session) { create(:session, :with_workshop) }
  let!(:waitlist) { create_list(:waitlist, 10, session:) }
  let(:context) { { session:, registration: } }

  context 'when the user is on the waitlist' do
    let(:registration) { waitlist.first.registration }

    it { is_expected.to be_success }

    it 'moves the user off the waitlist' do
      expect { result }.to change(session.waitlist, :count).by(-1)
    end

    it 'moves the user into the session' do
      expect { result }.to change(session.placements, :count).by(1)
    end
  end

  context 'when the user is not on the waitlist' do
    let(:registration) { create(:registration, festival: session.festival) }

    it 'raises an error' do
      expect { result }.to raise_error(Waitlists::Promote::NotOnWaitlist)
    end
  end
end
