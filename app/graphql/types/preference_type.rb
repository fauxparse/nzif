module Types
  class PreferenceType < Types::BaseObject
    field :id, ID, null: false
    field :position, Integer, null: false
    field :slot, SlotType, null: false
    field :workshop, WorkshopType, null: false

    def slot
      dataloader
        .with(Sources::Simple, context:, model: ::Slot)
        .load(object.slot_id)
    end

    def workshop
      dataloader
        .with(Sources::Simple, context:, model: ::Workshop)
        .load(object.session.activity_id)
    end
  end
end
