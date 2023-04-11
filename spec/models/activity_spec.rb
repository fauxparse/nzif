require 'rails_helper'

RSpec.describe Activity do
  describe '.search' do
    subject(:search) { described_class.search(query) }

    let(:query) { 'needle' }

    let(:festival) { create(:festival) }

    context 'with multiple matches' do
      let!(:description_match) { create(:show, description: 'needle', festival:) }
      let!(:name_match) { create(:workshop, name: 'needle', festival:) }

      it 'returns name matches first' do
        expect(search).to eq [name_match, description_match]
      end
    end

    context 'with stemming' do
      let!(:workshop) { create(:workshop, name: 'needling doubt', festival:) }

      it 'returns matches' do
        expect(search).to eq [workshop]
      end
    end

    context 'with a query that is a stop word' do
      let(:query) { 'the' }

      let!(:workshop) { create(:workshop, name: 'the needle', festival:) }

      it 'returns no results' do
        expect(search).not_to include workshop
      end
    end
  end

  describe '.to_param' do
    subject(:to_param) { Workshop.to_param }

    it { is_expected.to eq 'workshops' }
  end
end
