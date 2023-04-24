module Types
  class TimeRangeAttributes < BaseInputObject
    description 'A start and end time'

    argument :ends_at, GraphQL::Types::ISO8601DateTime, required: true,
      description: 'The time at which the slot ends'
    argument :starts_at, GraphQL::Types::ISO8601DateTime, required: true,
      description: 'The time at which the slot starts'
  end
end
