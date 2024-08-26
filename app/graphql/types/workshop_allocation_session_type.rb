module Types
  class WorkshopAllocationSessionType < BaseObject
    field :capacity, Integer, null: false
    field :ends_at, GraphQL::Types::ISO8601DateTime, null: false
    field :id, ID, null: false
    field :registrations, [RegistrationType], null: false
    field :slots, [SlotType], null: false
    field :starts_at, GraphQL::Types::ISO8601DateTime, null: false
    field :waitlist, [RegistrationType], null: false
    field :workshop, WorkshopType, null: false

    def session
      dataloader
        .with(Sources::Simple, context:, model: ::Session)
        .load(object.id)
    end

    def starts_at
      session.then(&:starts_at)
    end

    def ends_at
      session.then(&:ends_at)
    end

    def slots
      dataloader
        .with(Sources::SessionSlots, context:)
        .load(Session.decode_id(object.id))
    end

    def workshop
      dataloader
        .with(Sources::Simple, context:, model: ::Workshop.includes(:sessions))
        .load(object.activity_id)
    end

    def registrations
      dataloader
        .with(Sources::Simple, context:, model: ::Registration)
        .load_all(object.placements.map(&:id))
    end

    def waitlist
      dataloader
        .with(Sources::Simple, context:, model: ::Registration)
        .load_all(object.waitlist.map(&:id))
    end
  end
end
