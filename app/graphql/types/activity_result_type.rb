module Types
  class ActivityResultType < Types::BaseObject
    implements Types::SearchResultType

    field :activity, ActivityType, null: false

    def id
      "activity[#{activity.to_param}]"
    end

    def title
      activity.name
    end

    def description
      [
        activity.class.name,
        cast.map(&:name).to_sentence,
      ].compact_blank.join(' with ')
    end

    def url
      "/#{activity.festival.to_param}/#{activity.class.to_param}/#{activity.to_param}"
    end

    def cast
      dataloader
        .with(Sources::ActivityCast, context:, role:)
        .load(activity.id)
        .map(&:profile)
    end

    def role
      case activity
      when Show then :director
      when Workshop then :tutor
      when SocialEvent then :organiser
      end
    end

    delegate :activity, to: :object
  end
end
