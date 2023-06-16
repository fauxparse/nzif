require 'rails_helper'

RSpec.describe SessionPolicy, type: :policy do
  let(:user) { build_stubbed(:user) }

  let(:admin) { build_stubbed(:admin) }

  let(:record) { build_stubbed(:workshop) }

  let(:context) { { user: nil } }

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
  end
end
