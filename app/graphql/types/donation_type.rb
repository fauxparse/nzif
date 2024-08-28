module Types
  class DonationType < Types::BaseObject
    field :amount, MoneyType, null: false
    field :anonymous, Boolean, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :email, String, null: false
    field :id, ID, null: false
    field :message, String, null: true
    field :name, String, null: false
    field :newsletter, Boolean, null: false
  end
end
