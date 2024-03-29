require 'rails_helper'

RSpec.describe ActivityPolicy, type: :policy do
  let(:user) { build_stubbed(:user) }

  let(:admin) { build_stubbed(:admin) }

  let(:record) { build_stubbed(:workshop) }

  let(:context) { { user: nil } }

  describe_rule :index? do
    succeed 'when user is not logged in'

    succeed 'when user is logged in' do
      let(:context) { { user: } }
    end

    succeed 'when user is logged in as admin' do
      let(:context) { { user: admin } }
    end
  end

  describe_rule :create? do
    failed 'when user is not logged in'

    failed 'when the user is not an admin' do
      let(:context) { { user: } }
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

    succeed 'when the user is an admin' do
      let(:context) { { user: admin } }
    end

    succeed 'when the user is a tutor of the workshop' do
      let(:profile) { create(:profile, :with_user) }

      let(:context) { { user: profile.user } }

      before do
        record.cast.create!(profile:, role: :tutor)
      end
    end
  end
end
