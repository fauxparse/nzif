require 'rails_helper'

RSpec.describe RegistrationPolicy, type: :policy do
  let(:festival) { create(:festival) }

  let(:participant) { create(:user) }

  let(:user) { create(:user) }

  let(:admin) { create(:admin) }

  let(:registration_manager) { create(:user, permissions: [:registrations]) }

  let(:record) { create(:registration, user: participant, festival:) }

  let(:context) { { user: nil } }

  describe_rule :index? do
    failed 'when user is not logged in'

    failed 'when the user is not an admin' do
      let(:context) { { user: } }
    end

    succeed 'when the user is a registration manager' do
      let(:context) { { user: registration_manager } }
    end

    succeed 'when the user is an admin' do
      let(:context) { { user: admin } }
    end
  end

  describe_rule :create? do
    let(:record) { build(:registration, user: participant) }

    failed 'when user is not logged in'

    succeed 'when the user is not an admin' do
      let(:context) { { user: } }
    end

    succeed 'when the user is a registration manager' do
      let(:context) { { user: registration_manager } }
    end

    succeed 'when the user is an admin' do
      let(:context) { { user: admin } }
    end
  end

  describe_rule :update? do
    failed 'when user is not logged in'

    failed 'when the user is not an admin' do
      let(:context) { { user: } }
    end

    succeed 'when the user is editing their own registration' do
      let(:context) { { user: participant } }
    end

    succeed 'when the user is a registration manager' do
      let(:context) { { user: registration_manager } }
    end

    succeed 'when the user is an admin' do
      let(:context) { { user: admin } }
    end
  end

  describe_rule :manage? do
    failed 'when user is not logged in'

    failed 'when the user is not an admin' do
      let(:context) { { user: } }
    end

    failed 'when the user is editing their own registration' do
      let(:context) { { user: participant } }
    end

    succeed 'when the user is a registration manager' do
      let(:context) { { user: registration_manager } }
    end

    succeed 'when the user is an admin' do
      let(:context) { { user: admin } }
    end
  end

  describe 'relation scope' do
    subject(:registrations) do
      policy.apply_scope(Registration, type: :relation).all
    end

    let(:user) { create(:user, :with_profile) }
    let(:context) { { user: } }
    let!(:registration) { create(:registration, user:, festival:) }
    let!(:other_registration) { create(:registration, festival:) }

    it { is_expected.to include(registration) }

    it { is_expected.not_to include(other_registration) }

    context 'as an admin' do
      let(:admin) { create(:admin) }
      let(:context) { { user: admin } }

      it { is_expected.to include(registration) }

      it { is_expected.to include(other_registration) }
    end
  end
end
