require 'rails_helper'

RSpec.describe Placement do
  subject(:placement) { build(:placement) }

  it { is_expected.to be_valid }
end
