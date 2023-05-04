module Types
  class SlotAttributes < BaseInputObject
    description 'Attributes for adding or updating an activity slot'

    argument :activity_id, ID, required: false,
      description: 'Scheduled activity'
    argument :activity_type, Types::ActivityTypeType, required: false,
      description: 'The type of activity'
    argument :ends_at, GraphQL::Types::ISO8601DateTime, required: false,
      description: 'The time at which the slot ends'
    argument :starts_at, GraphQL::Types::ISO8601DateTime, required: false,
      description: 'The time at which the slot starts'
    argument :venue_id, ID, required: false, description: 'The ID of the venue'
  end
end