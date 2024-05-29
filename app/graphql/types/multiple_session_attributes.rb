module Types
  class MultipleSessionAttributes < BaseInputObject
    argument :activity_id, ID, required: false
    argument :activity_type, Types::ActivityTypeType, required: true
    argument :capacity, Integer, required: false
    argument :festival_id, ID, required: true
    argument :time_ranges, [Types::TimeRangeAttributes], required: true
    argument :venue_ids, [ID], required: true
  end
end
