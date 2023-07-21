require 'rails_helper'

RSpec.describe PlacenamePolicy, type: :policy do
  let(:user) { build_stubbed(:user) }

  let(:admin) { build_stubbed(:admin) }

  let(:content_manager) { build_stubbed(:user, permissions: [:content]) }

  let(:record) { build_stubbed(:placename) }

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

    failed 'when user is logged in' do
      let(:context) { { user: } }
    end

    succeed 'when user is logged in as a content manager' do
      let(:context) { { user: content_manager } }
    end

    succeed 'when user is logged in as admin' do
      let(:context) { { user: admin } }
    end
  end

  describe_rule :manage? do
    failed 'when user is not logged in'

    failed 'when user is logged in' do
      let(:context) { { user: } }
    end

    succeed 'when user is logged in as a content manager' do
      let(:context) { { user: content_manager } }
    end

    succeed 'when user is logged in as admin' do
      let(:context) { { user: admin } }
    end
  end
end
