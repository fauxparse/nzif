module Types
  class WorkshopSlotType < Types::BaseObject
    field :ends_at, GraphQL::Types::ISO8601DateTime, null: false
    field :id, ID, null: false
    field :starts_at, GraphQL::Types::ISO8601DateTime, null: false
    field :workshops, [Types::WorkshopType], null: false

    def id
      object.starts_at.iso8601
    end
  end
end
