require 'rails_helper'

RSpec.describe Mutations::Sessions::Destroy, type: :mutation do
  let(:query) do
    <<~GRAPHQL.squish
      mutation DestroySession($id: ID!) {
        destroySession(id: $id)
      }
    GRAPHQL
  end

  let!(:session) { create(:session) }

  let(:variables) do
    {
      id: session.to_param,
    }
  end

  context 'when logged in as admin' do
    let(:current_user) { create(:admin) }

    it 'destroys a session' do
      expect { result }.to change(Session, :count).by(-1)
    end
  end
end
