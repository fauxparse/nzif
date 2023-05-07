require 'rails_helper'

RSpec.describe UserPolicy, type: :policy do
  let(:user) { build_stubbed(:user) }

  let(:record) { build_stubbed(:user) }

  let(:context) { { user: nil } }

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
end
