require 'rails_helper'

RSpec.describe ActivityPolicy, type: :policy do
  let(:user) { build_stubbed(:user) }

  let(:admin) { create(:user, :admin) }

  let(:workshop) { build_stubbed(:workshop) }

  let(:context) { { user: nil } }

  describe_rule :index? do
    subject(:allowed) { policy.apply(:index?) }

    it { is_expected.to be_truthy }

    context 'when the user is an admin' do
      let(:context) { { user: admin } }

      it { is_expected.to be_truthy }
    end
  end

  describe_rule :create? do
    subject(:allowed) { policy.apply(:create?) }

    it { is_expected.to be_falsy }

    context 'when the user is an admin' do
      let(:context) { { user: admin } }

      it { is_expected.to be_truthy }
    end
  end

  describe_rule :manage? do
    subject(:allowed) { policy.apply(:manage?) }

    it { is_expected.to be false }

    context 'when the user is an admin' do
      let(:context) { { user: admin } }

      it { is_expected.to be true }
    end
  end
end
