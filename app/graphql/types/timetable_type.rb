module Types
  class TimetableType < Types::BaseObject
    description 'A timetable for a Festival'

    field :id, ID, null: false, description: 'The ID of the timetable'
    field :slots, [SlotType], null: false, description: 'The slots in the timetable'
  end
end
