require 'rails_helper'

RSpec.describe Activities::Rename, type: :interactor do
  describe '.call' do
    let(:activity) { create(:workshop) }

    let(:context) { { activity:, name: } }

    let(:name) { 'New name' }

    it { is_expected.to be_success }

    it 'renames the activity' do
      expect { result }.to change { activity.reload.name }.to(name)
    end

    it 'changes the slug' do
      expect { result }.to change { activity.reload.slug }.to('new-name')
    end

    context 'when there’s already an activity with a clashing slug' do
      before do
        create(:workshop, festival: activity.festival, slug: 'new-name')
      end

      it { is_expected.to be_success }

      it 'changes the slug to something new' do
        expect(result.activity.slug).to match(/\Anew-name-\d+\z/)
      end
    end

    context 'when the slug has been customised' do
      before do
        activity.update!(slug: 'sluggy')
      end

      it 'does not change the slug' do
        expect { result }.not_to change { activity.reload.slug }
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
