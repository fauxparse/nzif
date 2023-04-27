require 'rails_helper'

RSpec.describe Mutations::Slots::Update, type: :mutation do
  let(:query) do
    <<~GRAPHQL.squish
      mutation UpdateSlot($id: ID!, $attributes: SlotAttributes!) {
        updateSlot(id: $id, attributes: $attributes) {
          slot {
            id
            startsAt
          }
        }
      }
    GRAPHQL
  end

  let(:slot) { create(:slot) }

  let(:starts_at) { slot.starts_at - 1.hour }

  let(:variables) do
    {
      id: slot.to_param,
      attributes: {
        starts_at: starts_at.iso8601,
      },
    }
  end

  context 'when logged in as admin' do
    let(:current_user) { create(:user, :admin) }

    it 'updates the slot' do
      expect { result }.to change { slot.reload.starts_at }.by(-1.hour)
    end

    it 'returns the updated start time' do
      expect(data[:update_slot][:slot][:starts_at]).to eq starts_at.iso8601
    end
  end
end
