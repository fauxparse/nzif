module Types
  class CalendarSessionType < BaseObject
    field :feedback, FeedbackType, null: true
    field :full, Boolean, null: false
    field :hidden, Boolean, null: false
    field :id, ID, null: false
    field :session, SessionType, null: false
    field :waitlisted, Boolean, null: false

    def id
      object.session.to_param
    end

    def full
      object.session.full?
    end
  end
end
