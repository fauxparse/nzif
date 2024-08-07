require 'rails_helper'

RSpec.describe Mutations::Sessions::CreateMultiple, type: :mutation do
  let(:query) do
    <<~GRAPHQL.squish
      mutation CreateSessions($attributes: MultipleSessionAttributes!) {
        createSessions(attributes: $attributes) {
          sessions {
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
        festival_id: festival.to_param,
        activity_type: 'Workshop',
        venue_ids: [venue.to_param],
        time_ranges: [
          {
            starts_at: starts_at.iso8601,
            ends_at: ends_at.iso8601,
          },
          {
            starts_at: (starts_at + 1.day).iso8601,
            ends_at: (ends_at + 1.day).iso8601,
          },
        ],
        capacity: 15,
      },
    }
  end

  context 'when logged in as admin' do
    let(:current_user) { create(:admin) }

    it 'creates multiple sessions' do
      expect { result }.to change(Session, :count).by(2)
    end

    it 'saves the capacity' do
      result
      expect(Session.last.capacity).to eq 15
    end
  end
end
