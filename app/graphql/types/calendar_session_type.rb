module Types
  class CalendarSessionType < BaseObject
    field :hidden, Boolean, null: false
    field :id, ID, null: false
    field :session, SessionType, null: false
    field :waitlisted, Boolean, null: false

    def id
      object.session.id
    end
  end
end
