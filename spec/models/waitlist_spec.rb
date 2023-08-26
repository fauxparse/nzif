require 'rails_helper'

RSpec.describe Waitlist do
  subject(:waitlist) { build(:waitlist) }

  let(:session) { waitlist.session }
  let(:registration) { waitlist.registration }

  it { is_expected.to be_valid }

  context 'when the user is already on the waitlist' do
    before do
      create(:waitlist, session:, registration:)
    end

    it 'isn’t valid' do
      expect { waitlist.save! }.to raise_error(ActiveRecord::RecordNotUnique)
    end
  end

  context 'when the user is already in the workshop' do
    before do
      create(:placement, session:, registration:)
    end

    it { is_expected.not_to be_valid }
  end
end
