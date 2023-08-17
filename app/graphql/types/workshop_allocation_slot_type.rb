module Types
  class WorkshopAllocationSlotType < BaseObject
    field :id, ID, null: false
    field :sessions, [WorkshopAllocationSessionType], null: false
    field :starts_at, GraphQL::Types::ISO8601DateTime, null: false

    def id
      object[:starts_at].iso8601
    end

    def sessions
      object[:sessions].map do |session|
        {
          id: session.id,
          registrations: session.candidates.map(&:id),
          waitlist: session.waitlist.map(&:id),
          capacity: session.capacity,
          activity_id: session.activity.to_param,
        }
      end
    end
  end
end
