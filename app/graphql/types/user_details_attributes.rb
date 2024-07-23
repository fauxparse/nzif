module Types
  class UserDetailsAttributes < BaseInputObject
    argument :city, String, required: false
    argument :code_of_conduct_accepted_at, GraphQL::Types::ISO8601DateTime, required: false
    argument :country, String, required: false
    argument :email, String, required: false
    argument :name, String, required: false
    argument :phone, String, required: false
    argument :photo_permission, Boolean, required: false
    argument :pronouns, String, required: false
  end
end
