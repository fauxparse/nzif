require 'rails_helper'

RSpec.describe Mutations::Activities::Create, type: :mutation do
  let(:query) do
    <<~GRAPHQL.squish
      mutation CreateActivity($festivalId: ID!, $type: ActivityType!, $attributes: ActivityAttributes!, $slotId: ID) {
        createActivity(festivalId: $festivalId, type: $type, attributes: $attributes, slotId: $slotId) {
          activity {
            id
            name
            slug
            type
          }

          slot {
            activity {
              id
            }
          }
        }
      }
    GRAPHQL
  end

  let(:festival) { create(:festival) }

  let(:variables) do
    {
      festival_id: festival.to_param,
      type: 'Show',
      attributes: {
        name: 'Murder on a Boat',
      },
      slot_id: nil,
    }
  end

  context 'when logged in as admin' do
    let(:current_user) { create(:user, :admin) }

    it 'creates an activity' do
      expect { result }.to change(Activity, :count).by(1)
    end

    it 'returns the new activity' do
      expect(data[:create_activity][:activity]).to match a_hash_including(
        name: 'Murder on a Boat',
        slug: 'murder-on-a-boat',
        type: 'Show',
      )
    end

    context 'with a slot given' do
      let(:slot) { create(:slot, festival:, activity_type: Show) }

      let(:variables) do
        {
          festival_id: festival.to_param,
          type: 'Show',
          attributes: {
            name: 'Murder on a Boat',
          },
          slot_id: slot.to_param,
        }
      end

      it 'assigns the show to the slot' do
        result

        expect(slot.reload.activity.name).to eq 'Murder on a Boat'
      end

      it 'returns the new slot' do
        id = data[:create_activity][:activity][:id]

        expect(data[:create_activity][:slot][:activity][:id]).to eq id
      end
    end
  end

  context 'when logged in as a normal user' do
    let(:current_user) { create(:user) }

    it 'does not create an activity' do
      expect { result }.to raise_error ActionPolicy::Unauthorized
    end
  end
end
