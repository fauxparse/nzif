module Types
  class FestivalType < Types::BaseObject
    description 'A festival'

    field :id, ID, null: false, description: 'Year of the festival'

    field :activities, [Types::ActivityType], null: false do
      description 'Activities (including unscheduled ones)'
      argument :type, Types::ActivityTypeType, required: false, description: 'Activity type'
    end
    field :activity, Types::ActivityType, null: true do
      description 'Retrieve an activity by its type and slug'
      argument :slug, String, required: true, description: 'URL segment'
      argument :type, Types::ActivityTypeType, required: true, description: 'Activity type'
    end
    field :end_date, Types::ISODate, null: false, description: 'The last day of the festival'
    field :start_date, Types::ISODate, null: false, description: 'The first day of the festival'
    field :state, Types::FestivalStateType, null: false, description: 'State of the festival'

    def id
      object.start_date.year.to_s
    end

    def activities(type: nil)
      dataloader.with(Sources::ActivitiesByFestival, type:).load(object.id)
    end

    def activity(type:, slug:)
      dataloader.with(Sources::ActivitiesBySlug, festival: object, type:).load(slug)
    end
  end
end
