module Types
  class TimeRangeAttributes < BaseInputObject
    argument :ends_at, GraphQL::Types::ISO8601DateTime, required: true
    argument :starts_at, GraphQL::Types::ISO8601DateTime, required: true
  end
end
