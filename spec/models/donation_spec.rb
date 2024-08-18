require 'rails_helper'

RSpec.describe Donation do
  subject(:donation) { build(:donation) }

  it { is_expected.to be_valid }
  it { is_expected.to validate_presence_of(:name) }
  it { is_expected.to validate_presence_of(:email) }
  it { is_expected.to validate_numericality_of(:amount_cents).is_greater_than(0) }
end
