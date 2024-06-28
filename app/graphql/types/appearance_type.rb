module Types
  class AppearanceType < BaseObject
    field :activity, ActivityType, null: false
    field :id, ID, null: false, method: :to_param
    field :role, RoleType, null: false
    field :sessions, [SessionType], null: false

    def sessions
      return [object.session] if object.session.present?

      object.activity.sessions
    end
  end
end
