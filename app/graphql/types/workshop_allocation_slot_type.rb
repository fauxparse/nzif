module Types
  class WorkshopAllocationSlotType < BaseObject
    field :id, ID, null: false
    field :sessions, [WorkshopAllocationSessionType], null: false
    field :starts_at, GraphQL::Types::ISO8601DateTime, null: false

    def id
      object[:starts_at].iso8601
    end
  end
end
