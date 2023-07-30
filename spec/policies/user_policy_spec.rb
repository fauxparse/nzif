require 'rails_helper'

RSpec.describe UserPolicy, type: :policy do
  let(:user) { build_stubbed(:user) }

  let(:record) { build_stubbed(:user) }

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

      succeed 'when viewing themself' do
        let(:record) { user }
      end

      succeed 'when the user is an admin' do
        let(:user) { build_stubbed(:admin) }
      end
    end
  end

  describe 'relation scope' do
    subject(:users) do
      policy.apply_scope(User, type: :relation).all
    end

    let(:user) { create(:user, :with_profile) }
    let(:context) { { user: } }
    let!(:other_user) { create(:user) }

    it { is_expected.to be_empty }

    context 'as an admin' do
      let(:user) { create(:admin) }

      it { is_expected.to include(user) }

      it { is_expected.to include(other_user) }
    end
  end
end
