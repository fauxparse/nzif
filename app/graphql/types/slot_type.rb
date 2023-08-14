module Types
  class SlotType < Types::BaseObject
    field :ends_at, GraphQL::Types::ISO8601DateTime, null: false
    field :id, ID, null: false
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
  end
end
