module Types
  class SessionAttributes < BaseInputObject
    argument :activity_id, ID, required: false
    argument :activity_type, Types::ActivityTypeType, required: false
    argument :ends_at, GraphQL::Types::ISO8601DateTime, required: false
    argument :starts_at, GraphQL::Types::ISO8601DateTime, required: false
    argument :venue_id, ID, required: false
  end
end
