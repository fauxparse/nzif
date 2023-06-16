require 'rails_helper'

RSpec.describe Mutations::Sessions::Update, type: :mutation do
  let(:query) do
    <<~GRAPHQL.squish
      mutation UpdateSession($id: ID!, $attributes: SessionAttributes!) {
        updateSession(id: $id, attributes: $attributes) {
          session {
            id
            startsAt
          }
        }
      }
    GRAPHQL
  end

  let(:session) { create(:session) }

  let(:starts_at) { session.starts_at - 1.hour }

  let(:variables) do
    {
      id: session.to_param,
      attributes: {
        starts_at: starts_at.iso8601,
      },
    }
  end

  context 'when logged in as admin' do
    let(:current_user) { create(:admin) }

    it 'updates the session' do
      expect { result }.to change { session.reload.starts_at }.by(-1.hour)
    end

    it 'returns the updated start time' do
      expect(data[:update_session][:session][:starts_at]).to eq starts_at.iso8601
    end
  end
end
