module Types
  module ActivityType
    include BaseInterface

    field :id, ID, null: false
    field :name, String, null: false
    field :slug, String, null: false
    field :type, ActivityTypeType, null: false
    field :slots, [SlotType], null: false
    field :presenters, [PersonType], null: false
    field :description, String, null: true
    field :picture, Types::ActivityPictureType, null: true

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

    def slots
      dataloader
        .with(Sources::SlotsByActivity, context:)
        .load(object.id)
    end

    def picture
      object.picture && object
    end

    orphan_types(
      ShowType,
      WorkshopType,
      SocialEventType,
    )
  end
end
