require 'rails_helper'

RSpec.describe Activities::Move, type: :interactor do
  describe '.call' do
    let(:activity) { create(:workshop) }

    let(:context) { { activity:, slug: } }

    let(:slug) { 'new-slug' }

    it { is_expected.to be_success }

    it 'moves the activity' do
      expect { result }.to change { activity.reload.slug }.to(slug)
    end

    context 'when there’s already an activity with a clashing slug' do
      before do
        create(:workshop, festival: activity.festival, slug: 'new-slug')
      end

      it { is_expected.to be_success }

      it 'changes the slug to something new' do
        expect(result.activity.slug).to match(/\Anew-slug-\d+\z/)
      end
    end

    context 'when logged in as a pleb' do
      let(:current_user) { build_stubbed(:user) }

      it 'throws an error' do
        expect { result }.to raise_error(ActionPolicy::Unauthorized)
      end
    end
  end
end
