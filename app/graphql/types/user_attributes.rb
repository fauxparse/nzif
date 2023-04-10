module Types
  class UserAttributes < BaseInputObject
    description 'Attributes for updating a user'

    argument :email, String, required: false,
      description: 'The new email address for the user'
    argument :name, String, required: false,
      description: 'The new name for the user'
    argument :roles, [RoleType], required: false,
      description: 'The user’s roles'
  end
end
