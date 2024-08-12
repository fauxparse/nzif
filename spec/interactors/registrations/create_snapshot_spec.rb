require 'rails_helper'

RSpec.describe Registrations::CreateSnapshot do
  let(:registration) { create(:registration, :with_placements, festival:) }
  let(:festival) { create(:festival, :with_workshops, workshop_days: 3) }
  let(:context) { { registration:, action: 'test' } }

  before do
    freeze_time
  end

  after do
    unfreeze_time
  end

  describe '#snapshot' do
    subject(:snapshot) { result.snapshot }

    its(:metadata) { is_expected.to eq 'action' => 'test' }
  end

  describe '#snapshot_items' do
    subject(:snapshot_items) { result.snapshot.snapshot_items }

    it 'serializes the sessions' do
      expect(snapshot_items.map(&:item_type))
        .to match_array %w[Registration Session Session Session]
    end
  end
end
