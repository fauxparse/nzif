module Types
  module ActivityType
    include BaseInterface

    description 'An activity that may be scheduled during the Festival'

    field :id, ID, null: false, description: 'Unique ID'
    field :name, String, null: false, description: 'Activity name'
    field :slug, String, null: false, description: 'For use in URL generation'
    field :type, ActivityTypeType, null: false, description: 'Type of activity'

    definition_methods do
      def resolve_type(object, _context)
        case object
        when Show then Types::ShowType
        when Workshop then Types::WorkshopType
        else
          raise "Unexpected Activity: #{object.inspect}"
        end
      end
    end

    def type
      object.class
    end

    orphan_types(
      ShowType,
      WorkshopType,
    )
  end
end
