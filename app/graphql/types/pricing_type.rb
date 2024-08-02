# rubocop:disable GraphQL/ExtractType
module Types
  class PricingType < BaseObject
    field :base_workshop_price, MoneyType, null: false
    field :discount_limit, Integer, null: false
    field :discount_per_additional_workshop, MoneyType, null: false
    field :id, ID, null: false

    def id
      1
    end
  end
end
# rubocop:enable GraphQL/ExtractType
