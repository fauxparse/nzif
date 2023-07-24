module Types
  class ShowType < Types::BaseActivity
    implements Types::ActivityType

    field :booking_link, String, null: true
    field :workshop, WorkshopType, null: true

    def presenters
      directors
    end

    def workshop
      dataloader
        .with(Sources::AssociatedWorkshop, context:)
        .load(object.id)
    end

    def booking_link
      object.booking_link.presence
    end
  end
end
