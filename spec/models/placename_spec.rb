require 'rails_helper'

RSpec.describe Placename do
  subject(:placename) { create(:placename) }

  it { is_expected.to be_valid }
end
