module Types
  class CityType < BaseObject
    field :country, Country, null: false
    field :id, ID, null: false
    field :name, String, null: false
    field :traditional_names, [String], null: false
  end
end
