module Types
  class ShowType < Types::BaseActivity
    implements Types::ActivityType

    field :workshop, WorkshopType, null: true

    def presenters
      directors
    end

    def workshop
      dataloader
        .with(Sources::AssociatedWorkshop, context:)
        .load(object.id)
    end
  end
end
