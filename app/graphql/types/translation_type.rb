module Types
  class TranslationType < Types::BaseObject
    field :country, Country, null: false
    field :id, ID, null: false
    field :name, String, null: false
    field :traditional_name, String, null: false

    delegate :id, to: :object
  end
end
