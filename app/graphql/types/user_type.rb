module Types
  class UserType < Types::BaseObject
    field :email, String, null: false
    field :id, ID, null: false
    field :name, String, null: false
    field :permissions, [PermissionType], null: false
    field :preferences, [PreferenceType], null: false
    field :profile, PersonType, null: true

    def profile
      dataloader
        .with(Sources::UserProfile, context:)
        .load(object.id)
    end

    def permissions
      object.permissions.map(&:name)
    end

    def preferences
      object.class.preferences.values.map do |preference|
        preference.to_graphql_object_for(object)
      end
    end
  end
end
