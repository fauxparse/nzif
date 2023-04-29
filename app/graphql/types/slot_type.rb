module Types
  class SlotType < Types::BaseObject
    description 'A slot in the Festival schedule'

    field :activity, ActivityType, null: true,
      description: 'The activity that will take place during this slot'
    field :activity_type, ActivityTypeType, null: false,
      description: 'The type of activity that will take place during this slot'
    field :ends_at, GraphQL::Types::ISO8601DateTime, null: false,
      description: 'The time at which the slot ends'
    field :id, ID, null: false, description: 'The ID of the slot'
    field :starts_at, GraphQL::Types::ISO8601DateTime, null: false,
      description: 'The time at which the slot starts'
    field :venue, VenueType, null: true, description: 'The venue where the slot will take place'
  end
end
