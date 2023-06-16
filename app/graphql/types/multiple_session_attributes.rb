module Types
  class MultipleSessionAttributes < BaseInputObject
    argument :activity_type, Types::ActivityTypeType, required: true
    argument :festival_id, ID, required: true
    argument :time_ranges, [Types::TimeRangeAttributes], required: true
    argument :venue_ids, [ID], required: true
  end
end
