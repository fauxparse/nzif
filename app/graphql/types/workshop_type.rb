module Types
  class WorkshopType < Types::BaseActivity
    implements Types::ActivityType

    field :show, ShowType, null: true
    field :stats, WorkshopStatType, null: false
    field :suitability, String, null: true

    def presenters
      tutors
    end

    def show
      dataloader
        .with(Sources::AssociatedShow, context:)
        .load(object.id)
    end

    def stats
      dataloader
        .with(Sources::WorkshopStats, context:)
        .load(object.id)
    end
  end
end
