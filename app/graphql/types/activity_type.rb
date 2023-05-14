module Types
  module ActivityType
    include BaseInterface

    description 'An activity that may be scheduled during the Festival'

    field :id, ID, null: false, description: 'Unique ID'
    field :name, String, null: false, description: 'Activity name'
    field :slug, String, null: false, description: 'For use in URL generation'
    field :type, ActivityTypeType, null: false, description: 'Type of activity'
    field :slots, [SlotType], null: false, description: 'Slots for this activity'
    field :presenters, [PersonType], null: false,
      description: 'People responsible for putting on this activity'
    field :description, String, null: true, description: 'Description of the activity'

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

    orphan_types(
      ShowType,
      WorkshopType,
      SocialEventType,
    )
  end
end
