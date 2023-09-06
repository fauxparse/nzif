require 'rails_helper'

RSpec.describe Registration do
  subject(:registration) { build(:registration) }

  it { is_expected.to be_valid }

  describe '#create_snapshot' do
    subject(:snapshot) { registration.create_snapshot! }

    let(:registration) { create(:registration, :with_placements, festival:) }
    let(:festival) { create(:festival, :with_workshops, workshop_days: 3) }

    describe '#snapshot_items' do
      subject(:snapshot_items) { snapshot.snapshot_items }

      it 'serializes the placements' do
        expect(snapshot_items.map(&:item_type))
          .to eq %w[Registration Placement Placement Placement]
      end
    end
  end
end
