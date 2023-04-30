module Types
  class ActivityResultType < Types::BaseObject
    implements Types::SearchResultType

    description 'A search result from an activity'

    field :activity, ActivityType, null: false, description: 'Activity'

    def id
      "activity[#{activity.to_param}]"
    end

    def title
      activity.name
    end

    def description
      activity.class.name
    end

    def url
      "/#{activity.festival.to_param}/#{activity.class.to_param}/#{activity.to_param}"
    end

    delegate :activity, to: :object
  end
end
