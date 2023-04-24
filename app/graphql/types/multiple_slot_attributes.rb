module Types
  class MultipleSlotAttributes < BaseInputObject
    description 'Attributes for adding or updating an activity slot'

    argument :activity_type, Types::ActivityTypeType, required: true,
      description: 'The type of activity'
    argument :festival_id, ID, required: true,
      description: 'The ID of the festival to which the slots belong'
    argument :time_ranges, [Types::TimeRangeAttributes], required: true,
      description: 'Time slots'
    argument :venue_ids, [ID], required: true, description: 'The ID(s) of the venue(s)'
  end
end
