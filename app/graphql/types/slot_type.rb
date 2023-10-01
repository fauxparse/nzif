module Types
  class SlotType < Types::BaseObject
    field :ends_at, GraphQL::Types::ISO8601DateTime, null: false
    field :id, ID, null: false
    field :sessions, [Types::SessionType], null: false do
      argument :type, ActivityTypeType, required: false
    end
    field :starts_at, GraphQL::Types::ISO8601DateTime, null: false
    field :workshops, [Types::WorkshopType], null: false

    def id
      object.starts_at.iso8601
    end

    def workshops
      object.activities.select { |a| a.type == 'Workshop' }.sort_by(&:name).map do |workshop|
        session = workshop.sessions.find { |s| s.starts_at == object.starts_at }
        workshop.capacity = session&.capacity || 0
        workshop
      end
    end

    def sessions(type: Workshop)
      object.activities.select { |a| a.type == type.name }.sort_by(&:name).map do |activity|
        activity.sessions.find { |s| s.starts_at == object.starts_at }
      end
    end
  end
end
