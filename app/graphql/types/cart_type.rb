module Types
  class CartType < Types::BaseObject
    field :id, ID, null: false

    field :discount, MoneyType, null: false
    field :outstanding, MoneyType, null: false
    field :paid, MoneyType, null: false
    field :total, MoneyType, null: false
    field :value, MoneyType, null: false
    field :workshops_count, Integer, null: false

    def id
      object.registration.to_param
    end
  end
end
