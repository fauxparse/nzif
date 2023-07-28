module Types
  class CartType < Types::BaseObject
    field :id, ID, null: false

    field :discount, Integer, null: false
    field :outstanding, Integer, null: false
    field :paid, Integer, null: false
    field :total, Integer, null: false
    field :value, Integer, null: false
    field :workshops_count, Integer, null: false
  end
end
