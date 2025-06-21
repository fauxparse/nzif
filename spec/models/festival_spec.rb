require 'rails_helper'

RSpec.describe Festival do
  subject(:festival) { build(:festival) }

  it { is_expected.to be_valid }

  describe '#end_date' do
    subject(:end_date) { festival.end_date }

    before { festival.validate }

    context 'when before start_date' do
      let(:festival) do
        build(:festival, start_date: Date.civil(2024, 10, 4), end_date: Date.civil(2023, 10, 1))
      end

      it 'has an error' do
        expect(festival.errors[:end_date]).to include('must be after 2024-10-04')
      end
    end

    context 'when in a different year from start_date' do
      let(:festival) do
        build(:festival, start_date: Date.civil(2024, 10, 4), end_date: Date.civil(2025, 10, 14))
      end

      it 'has an error' do
        expect(festival.errors[:end_date]).to include('must be the same year as 2024-10-04')
      end
    end
  end

  describe '#year' do
    before do
      create(:festival, start_date: Date.civil(2025, 7, 22), end_date: Date.civil(2025, 7, 29))
    end

    it 'must be unique' do
      expect(festival).not_to be_valid
    end
  end

  describe '#state' do
    subject(:state) { festival.state }

    before do
      travel_to Time.zone.local(2025, 7, 27, 13, 0)
    end

    context 'when in the past' do
      let(:festival) { create(:festival, start_date: 1.year.ago.beginning_of_month) }

      it { is_expected.to eq(:finished) }

      it 'is in scope' do
        expect(described_class.finished).to include(festival)
      end
    end

    context 'when in the future' do
      let(:festival) { create(:festival, start_date: 1.year.from_now.beginning_of_month) }

      it { is_expected.to eq(:upcoming) }

      it 'is in scope' do
        expect(described_class.upcoming).to include(festival)
      end
    end

    context 'when happening now' do
      let(:festival) { create(:festival, start_date: 1.day.ago, end_date: Time.zone.today) }

      it { is_expected.to eq(:happening) }

      it 'is in scope' do
        expect(described_class.happening).to include(festival)
      end
    end
  end

  describe '#to_param' do
    subject(:to_param) { festival.to_param }

    it { is_expected.to eq(festival.year.to_s) }
  end

  describe '.find' do
    subject(:found) { described_class.find(year) }

    before { festival.save! }

    context 'when it exists' do
      let(:year) { festival.year }

      it { is_expected.to eq(festival) }
    end

    context 'when it does not exist' do
      let(:year) { '1666' }

      it 'raises an exception' do
        expect { found }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
