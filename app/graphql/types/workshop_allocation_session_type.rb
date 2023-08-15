module Types
  class WorkshopAllocationSessionType < BaseObject
    field :capacity, Integer, null: false
    field :id, ID, null: false, hash_key: :id # rubocop:disable GraphQL/UnnecessaryFieldAlias
    field :registrations, [RegistrationType], null: false
    field :waitlist, [RegistrationType], null: false
    field :workshop, WorkshopType, null: false

    def session
      dataloader
        .with(Sources::Simple, context:, model: ::Session)
        .load(object[:id])
    end

    def workshop
      dataloader
        .with(Sources::Simple, context:, model: ::Workshop.includes(:sessions))
        .load(object[:activity_id])
    end

    def registrations
      dataloader
        .with(Sources::Simple, context:, model: ::Registration)
        .load_all(object[:registrations])
    end

    def waitlist
      dataloader
        .with(Sources::Simple, context:, model: ::Registration)
        .load_all(object[:waitlist])
    end
  end
end
