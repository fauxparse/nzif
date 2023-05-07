require 'rails_helper'

RSpec.describe Mutations::Slots::Destroy, type: :mutation do
  let(:query) do
    <<~GRAPHQL.squish
      mutation DestroySlot($id: ID!) {
        destroySlot(id: $id)
      }
    GRAPHQL
  end

  let!(:slot) { create(:slot) }

  let(:variables) do
    {
      id: slot.to_param,
    }
  end

  context 'when logged in as admin' do
    let(:current_user) { create(:admin) }

    it 'destroys a slot' do
      expect { result }.to change(Slot, :count).by(-1)
    end
  end
end
