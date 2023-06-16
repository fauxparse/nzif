require 'rails_helper'

RSpec.describe Mutations::Activities::Create, type: :mutation do
  let(:query) do
    <<~GRAPHQL.squish
      mutation CreateActivity($festivalId: ID!, $type: ActivityType!, $attributes: ActivityAttributes!, $sessionId: ID) {
        createActivity(festivalId: $festivalId, type: $type, attributes: $attributes, sessionId: $sessionId) {
          activity {
            id
            name
            slug
            type
          }

          session {
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
      session_id: nil,
    }
  end

  context 'when logged in as admin' do
    let(:current_user) { create(:admin) }

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

    context 'with a session given' do
      let(:session) { create(:session, festival:, activity_type: Show) }

      let(:variables) do
        {
          festival_id: festival.to_param,
          type: 'Show',
          attributes: {
            name: 'Murder on a Boat',
          },
          session_id: session.to_param,
        }
      end

      it 'assigns the show to the session' do
        result

        expect(session.reload.activity.name).to eq 'Murder on a Boat'
      end

      it 'returns the new session' do
        id = data[:create_activity][:activity][:id]

        expect(data[:create_activity][:session][:activity][:id]).to eq id
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
