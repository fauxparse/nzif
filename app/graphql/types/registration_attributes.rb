module Types
  class RegistrationAttributes < BaseInputObject
    argument :code_of_conduct_accepted_at, GraphQL::Types::ISO8601DateTime, required: false
    argument :donate_discount, Boolean, required: false
    argument :photo_permission, Boolean, required: false
  end
end
