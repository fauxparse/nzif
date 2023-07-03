module Types
  class TimetableType < Types::BaseObject
    field :id, ID, null: false
    field :sessions, [SessionType], null: false

    def sessions
      object.sessions.includes(
        :activity,
        :venue,
        cast: { profile: :user },
      ).references(:activities)
    end
  end
end
