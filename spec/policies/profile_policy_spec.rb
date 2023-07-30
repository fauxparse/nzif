require 'rails_helper'

RSpec.describe ProfilePolicy, type: :policy do
  let(:user) { create(:user, :with_profile) }

  let(:record) { user.profile }

  let(:context) { { user: nil } }

  describe_rule :index? do
    failed 'when user is not logged in'

    failed 'when user is logged in' do
      let(:context) { { user: } }

      failed 'when the user is not an admin'

      succeed 'when the user is an admin' do
        let(:user) { build_stubbed(:admin) }
      end
    end
  end

  describe_rule :show? do
    failed 'when user is not logged in'

    failed 'when user is logged in' do
      let(:context) { { user: } }

      let(:record) { create(:profile) }

      succeed 'when viewing themself' do
        let(:record) { user.profile }
      end

      succeed 'when the user is an admin' do
        let(:user) { build_stubbed(:admin) }
      end
    end
  end

  describe_rule :update? do
    failed 'when user is not logged in'

    failed 'when user is logged in' do
      let(:context) { { user: } }

      let(:record) { create(:profile) }

      succeed 'when updating themself' do
        let(:record) { user.profile }
      end

      succeed 'when the user has people permissions' do
        let(:user) { build_stubbed(:user, permissions: [:people]) }
      end

      succeed 'when the user is an admin' do
        let(:user) { build_stubbed(:admin) }
      end
    end
  end

  describe_rule :create? do
    succeed
  end

  describe 'relation scope' do
    subject(:users) do
      policy.apply_scope(Profile, type: :relation).all
    end

    let(:user) { create(:user, :with_profile) }
    let(:context) { { user: } }
    let!(:other_user) { create(:user, :with_profile) }

    it { is_expected.to be_empty }

    context 'as an admin' do
      let(:user) { create(:admin) }

      it { is_expected.to include(user.profile) }

      it { is_expected.to include(other_user.profile) }
    end
  end
end
