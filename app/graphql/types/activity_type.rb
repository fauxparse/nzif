module Types
  module ActivityType
    include BaseInterface

    field :id, ID, null: false
    field :name, String, null: false
    field :slug, String, null: false
    field :type, ActivityTypeType, null: false
    field :sessions, [SessionType], null: false
    field :presenters, [PersonType], null: false
    field :description, String, null: true
    field :picture, Types::ActivityPictureType, null: true
    field :missing_info, [String], null: false

    definition_methods do
      def resolve_type(object, _context)
        case object
        when Show then Types::ShowType
        when Workshop then Types::WorkshopType
        when SocialEvent then Types::SocialEventType
        else
          raise "Unexpected Activity: #{object.inspect}"
        end
      end
    end

    def type
      object.class
    end

    def sessions
      dataloader
        .with(Sources::SessionsByActivity, context:)
        .load(object.id)
    end

    def picture
      object.picture && object
    end

    # rubocop:disable Metrics/AbcSize, Metrics/PerceivedComplexity
    def missing_info
      [].tap do |missing|
        missing << 'Description' if object.description.blank?
        missing << 'Image' if object.picture.blank?
        missing << 'Presenter bio' if presenters.any? { |p| p.bio.blank? }
        missing << 'Presenter image' if presenters.any? { |p| p.picture.blank? }
        missing << 'Suitability' if object.is_a?(Workshop) && object.suitability.blank?
      end
    end
    # rubocop:enable Metrics/AbcSize, Metrics/PerceivedComplexity

    orphan_types(
      ShowType,
      WorkshopType,
      SocialEventType,
    )
  end
end
