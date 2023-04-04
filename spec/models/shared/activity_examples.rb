shared_examples 'an activity' do |type:|
  describe '#slug' do
    subject(:activity) { create(type, name: 'The History Boy', festival:) }

    let(:slug) { activity.slug }
    let(:festival) { create(:festival) }

    let(:other_type) { type == :show ? :workshop : :show }

    it 'is generated from the name' do
      expect(slug).to eq 'the-history-boy'
    end

    context 'when there is a clash' do
      before { create(type, name: 'The History Boy', festival:) }

      it 'includes a deduplication suffix' do
        expect(slug).to match(/\Athe-history-boy-\d+\z/)
      end
    end

    context 'when there is an activity of a different type with the same name' do
      before { create(other_type, name: 'The History Boy', festival:) }

      it 'does not include a deduplication suffix' do
        expect(slug).to eq 'the-history-boy'
      end
    end
  end
end
