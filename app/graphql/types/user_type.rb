module Types
  class UserType < Types::BaseObject
    field :activities, [ActivityType], null: false
    field :email, String, null: false
    field :id, ID, null: false
    field :name, String, null: false
    field :permissions, [PermissionType], null: false
    field :profile, PersonType, null: true
    field :registration, RegistrationType, null: true
    field :settings, [SettingType], null: false

    def id
      super || ''
    end

    def email
      object.email || ''
    end

    def profile
      dataloader
        .with(Sources::UserProfile, context:)
        .load(object.id)
    end

    def permissions
      object.permissions.map(&:name)
    end

    def settings
      object.class.settings.values.map do |setting|
        setting.to_graphql_object_for(object)
      end
    end

    def activities
      # return current_festival.activities.scheduled.distinct if object.admin?

      dataloader
        .with(Sources::UserActivities, context:, festival: current_festival)
        .load(object.id)
    end

    def registration
      dataloader
        .with(Sources::UserRegistration, context:, festival: current_festival)
        .load(object.id)
    end
  end
end
