require 'rails_helper'

RSpec.describe Slot do
  subject(:slot) { build(:slot, festival:, venue:) }

  let(:festival) { create(:festival) }
  let(:venue) { create(:venue) }

  it { is_expected.to be_valid }

  describe '#activity_type' do
    subject(:activity_type) { slot.activity_type }

    it { is_expected.to eq Workshop }
  end

  context 'when the start time is before the start date of the festival' do
    before do
      slot.starts_at = (slot.festival.start_date - 1.day).beginning_of_day
    end

    it { is_expected.not_to be_valid }
  end

  context 'when the end time is after the end date of the festival' do
    before do
      slot.ends_at = (slot.festival.end_date + 2.days).beginning_of_day
    end

    it { is_expected.not_to be_valid }
  end

  context 'with a bad activity type' do
    it 'raises an error' do
      expect { slot.activity_type = 'Prank' }.to raise_error(/not a valid activity_type/)
    end
  end

  context 'when there is another activity overlapping' do
    before do
      create(
        :slot,
        festival:,
        venue:,
        activity_type: Workshop,
        starts_at: slot.starts_at - 1.hour,
        ends_at: slot.ends_at - 1.hour,
      )
    end

    it { is_expected.not_to be_valid }
  end

  describe '.activity_type_values' do
    subject(:activity_type_values) { described_class.activity_type_values }

    it { is_expected.to eq %i[Workshop Show] }
  end
end
