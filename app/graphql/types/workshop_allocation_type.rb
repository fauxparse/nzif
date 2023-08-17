module Types
  class WorkshopAllocationType < BaseObject
    field :id, ID, null: false
    field :score, Float, null: true
    field :slots, [WorkshopAllocationSlotType], null: false
    field :state, JobStateType, null: false

    def state
      object.completed? ? :completed : :working
    end

    def score
      return nil unless object.completed?

      object.score / 100.0
    end

    def slots
      return [] if object.data.blank?

      object.data.sessions.values.group_by(&:starts_at).map do |starts_at, sessions|
        {
          id: starts_at.to_s,
          starts_at:,
          sessions:,
        }
      end
    end
  end
end
