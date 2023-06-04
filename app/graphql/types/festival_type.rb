module Types
  class FestivalType < Types::BaseObject
    field :id, ID, null: false

    field :activities, [Types::ActivityType], null: false do
      argument :type, Types::ActivityTypeType, required: false
    end
    field :activity, Types::ActivityType, null: true do
      argument :slug, String, required: true
      argument :type, Types::ActivityTypeType, required: true
    end
    field :end_date, Types::ISODate, null: false
    field :start_date, Types::ISODate, null: false
    field :state, Types::FestivalStateType, null: false
    field :timetable, Types::TimetableType, null: false
    field :venues, [Types::VenueType], null: false
    field :workshop_slots, [Types::WorkshopSlotType], null: false

    def id
      object.start_date.year.to_s
    end

    def activities(type: nil)
      dataloader
        .with(Sources::ActivitiesByFestival, context:, type:)
        .load(object.id)
    end

    def activity(type:, slug:)
      dataloader
        .with(Sources::ActivitiesBySlug, context:, festival: object, type:)
        .load(slug)
    end

    def timetable
      object
    end

    def venues
      dataloader
        .with(Sources::VenuesByFestival, context:)
        .load(object.id)
    end

    def workshop_slots
      object.slots.includes(:activity)
        .where(activity_type: 'Workshop').where.not(activity_id: nil)
        .order(:starts_at).group_by(&:starts_at).map do |starts_at, group|
          Hashie::Mash.new(
            id: starts_at.iso8601,
            starts_at:,
            ends_at: group.map(&:ends_at).max,
            workshops: group.map(&:activity),
          )
        end
    end
  end
end
