module Types
  module Activity
    include Types::BaseInterface

    description 'An activity that may be scheduled during the Festival'

    field :id, ID, null: false, description: 'Unique ID'
    field :name, String, null: false, description: 'Activity name'
    field :slug, String, null: false, description: 'For use in URL generation'

    definition_methods do
      def resolve_type(object, _context)
        case object
        when ::Show then Types::Show
        when ::Workshop then Types::Workshop
        else
          raise "Unexpected Activity: #{object.inspect}"
        end
      end
    end

    orphan_types(
      Types::Show,
      Types::Workshop,
    )
  end
end
