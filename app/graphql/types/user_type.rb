module Types
  class UserType < Types::BaseObject
    field :email, String, null: false
    field :id, ID, null: false
    field :name, String, null: false
    field :profile, PersonType, null: true
    field :roles, [RoleType], null: false

    def profile
      dataloader
        .with(Sources::UserProfile, context:)
        .load(object.id)
    end
  end
end
