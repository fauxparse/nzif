require 'rails_helper'

RSpec.describe Mutations::Sessions::Create, type: :mutation do
  let(:query) do
    <<~GRAPHQL.squish
      mutation CreateSession($festivalId: ID!, $attributes: SessionAttributes!) {
        createSession(festivalId: $festivalId, attributes: $attributes) {
          session {
            id
          }
        }
      }
    GRAPHQL
  end

  let(:festival) { create(:festival) }

  let(:venue) { create(:venue) }

  let(:starts_at) { festival.start_date + 2.days + 10.hours }

  let(:ends_at) { starts_at + 3.hours }

  let(:variables) do
    {
      festival_id: festival.to_param,
      attributes: {
        activity_type: 'Workshop',
        starts_at: starts_at.iso8601,
        ends_at: ends_at.iso8601,
        venue_id: venue.to_param,
      },
    }
  end

  context 'when logged in as admin' do
    let(:current_user) { create(:admin) }

    it 'creates a session' do
      expect { result }.to change(Session, :count).by(1)
    end
  end
end
