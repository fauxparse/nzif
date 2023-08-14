module Types
  class WorkshopAllocationType < BaseObject
    field :id, ID, null: false
    field :score, Float, null: true
    field :state, JobStateType, null: false

    def state
      object.completed? ? :completed : :working
    end

    def score
      return nil unless object.completed?

      object.score / 100.0
    end
  end
end
