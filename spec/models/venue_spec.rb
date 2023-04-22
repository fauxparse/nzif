require 'rails_helper'

RSpec.describe Venue do
  subject(:venue) { build(:venue) }

  it { is_expected.to be_valid }

  describe 'geocoding' do
    before { venue.save! }

    it 'geocodes the address' do # rubocop:disable RSpec/MultipleExpectations
      expect(venue.latitude).to be_within(0.01).of(-41.2921901197085)
      expect(venue.longitude).to be_within(0.01).of(174.7858539802915)
    end
  end
end
