module Types
  class SessionType < Types::BaseObject
    field :activity, ActivityType, null: true
    field :activity_type, ActivityTypeType, null: false
    field :ends_at, GraphQL::Types::ISO8601DateTime, null: false
    field :id, ID, null: false
    field :starts_at, GraphQL::Types::ISO8601DateTime, null: false
    field :venue, VenueType, null: true
  end
end
