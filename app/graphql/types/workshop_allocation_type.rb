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
      (object.original.deep_symbolize_keys[:sessions] || [])
        .group_by { |s| Time.zone.parse(s[:starts_at].to_s) }
        .map do |starts_at, sessions|
          {
            id: starts_at.to_s,
            starts_at:,
            sessions:,
          }
        end
    end
  end
end
