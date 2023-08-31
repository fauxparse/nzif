module Types
  class WaitlistType < BaseObject
    field :id, ID, null: false
    field :offered_at, GraphQL::Types::ISO8601DateTime, null: true
    field :position, Integer, null: false
    field :registration, RegistrationType, null: false
  end
end
