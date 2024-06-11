module Types
  class CityAttributes < BaseInputObject
    argument :country, String, required: true
    argument :name, String, required: true
    argument :traditional_names, [String], required: false
  end
end
