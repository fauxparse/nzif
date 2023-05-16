module Types
  class TimetableType < Types::BaseObject
    field :id, ID, null: false
    field :slots, [SlotType], null: false
  end
end
