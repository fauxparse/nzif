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
    field :slots, [Types::SlotType], null: false do
      argument :type, Types::ActivityTypeType, required: false
    end
    field :start_date, Types::ISODate, null: false
    field :state, Types::FestivalStateType, null: false
    field :timetable, Types::TimetableType, null: false
    field :venues, [Types::VenueType], null: false

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

    def slots(type: nil)
      scope = object.slots.includes(:activities)
      scope = scope.references(:activities).where(activities: { type: type.to_s }) if type
      scope
    end
  end
end
