module Types
  class UserAttributes < BaseInputObject
    argument :email, String, required: false
    argument :name, String, required: false
    argument :roles, [RoleType], required: false
  end
end
