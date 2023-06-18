module Types
  class PreferenceType < Types::BaseObject
    field :id, ID, null: false
    field :position, Integer, null: false
    field :slot, SlotType, null: false
    field :workshop, WorkshopType, null: false
  end
end
