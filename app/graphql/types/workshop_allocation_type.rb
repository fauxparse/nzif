module Types
  class WorkshopAllocationType < BaseObject
    field :id, ID, null: false
    field :score, Float, null: true
    field :slot, WorkshopAllocationSlotType, null: false do
      argument :starts_at, GraphQL::Types::ISO8601DateTime, required: true
    end
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

    def slot(starts_at:)
      sessions = object.data.sessions.values.select { |s| s.starts_at == starts_at }
      {
        id: starts_at.to_s,
        starts_at:,
        sessions:,
      }
    end
  end
end
