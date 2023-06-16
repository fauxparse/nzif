# frozen_string_literal: true

module Types
  class PreferenceType < Types::BaseObject
    field :id, ID, null: false
    field :registration_id, Integer, null: false
    field :slot_id, Integer, null: false
    field :starts_at, GraphQL::Types::ISO8601DateTime
    field :position, Integer
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
