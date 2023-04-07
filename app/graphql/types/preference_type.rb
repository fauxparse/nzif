module Types
  module PreferenceType
    include BaseInterface

    description 'A user preference'

    field :id, String, null: false, description: 'Preference ID'
    field :description, String, null: false, description: 'Preference description'

    definition_methods do
      def resolve_type(object, _context)
        case object[:type]
        when :boolean then Types::BooleanPreferenceType
        when :string then Types::StringPreferenceType
        else
          raise "Unexpected Preference: #{object[:type]}"
        end
      end
    end

    def id
      object.id.to_s.camelize(:lower)
    end

    orphan_types(
      BooleanPreferenceType,
      StringPreferenceType,
    )
  end
end
