module Types
  class UserAttributes < BaseInputObject
    argument :email, String, required: false
    argument :name, String, required: false
    argument :permissions, [PermissionType], required: false
  end
end
