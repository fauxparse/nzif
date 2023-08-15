module Types
  class PreferenceType < Types::BaseObject
    field :id, ID, null: false
    field :position, Integer, null: false
    field :slot, SlotType, null: false
    field :workshop, WorkshopType, null: false

    def slot
      dataloader
        .with(Sources::Slots, context:)
        .load(object.slot_id)
    end

    def workshop
      dataloader
        .with(Sources::Simple, context:, model: ::Workshop)
        .load(::Workshop.encode_id(object.session.activity_id))
    end
  end
end
