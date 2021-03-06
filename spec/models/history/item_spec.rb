require 'rails_helper'

RSpec.describe History::Item, type: :model do
  subject(:item) { History::Item.create }

  it { is_expected.to be_valid }

  its(:icon) { is_expected.to eq 'clock' }

  describe '#mentions' do
    subject(:mentions) { item.mentions }

    it { is_expected.to be_empty }
  end
end
