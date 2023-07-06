module Types
  class ShowType < Types::BaseActivity
    implements Types::ActivityType

    field :show, ShowType, null: true

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
