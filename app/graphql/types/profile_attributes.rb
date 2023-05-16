module Types
  class ProfileAttributes < BaseInputObject
    argument :bio, String, required: false
    argument :city, String, required: false
    argument :country, Country, required: false
    argument :name, String, required: false
    argument :pronouns, String, required: false
  end
end
