require 'rails_helper'

RSpec.describe Registration do
  subject(:registration) { build(:registration) }

  it { is_expected.to be_valid }
end
