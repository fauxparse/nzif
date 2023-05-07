module Types
  class ProfileAttributes < BaseInputObject
    description 'Attributes for adding or updating a user’s profile'

    argument :bio, String, required: false,
      description: 'A short bio'
    argument :city, String, required: false,
      description: 'The person’s home city'
    argument :country, Country, required: false,
      description: 'The person’s home country'
    argument :name, String, required: false,
      description: 'The name of the person'
  end
end
