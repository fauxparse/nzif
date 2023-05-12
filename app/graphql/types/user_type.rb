module Types
  class UserType < Types::BaseObject
    description 'A user'

    field :email, String, null: false, description: 'Email address'
    field :id, ID, null: false, description: 'Unique ID'
    field :name, String, null: false, description: 'Name'
    field :profile, PersonType, null: true, description: 'Profile information'
    field :roles, [RoleType], null: false, description: 'Authorized roles'

    def profile
      dataloader
        .with(Sources::UserProfile, context:)
        .load(object.id)
    end
  end
end
