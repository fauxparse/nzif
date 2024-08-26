module Types
  class WorkshopAllocationType < BaseObject
    field :id, ID, null: false
    field :score, Float, null: true
    field :sessions, [WorkshopAllocationSessionType], null: false
    field :state, JobStateType, null: false

    def state
      object.completed? ? :completed : :working
    end

    def score
      return nil unless object.completed?

      object.score / 100.0
    end

    def sessions
      return [] if object.data.blank?

      object.data.sessions.values
    end
  end
end
