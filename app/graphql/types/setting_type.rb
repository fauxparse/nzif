module Types
  module SettingType
    include BaseInterface

    field :id, String, null: false
    field :description, String, null: false

    definition_methods do
      def resolve_type(object, _context)
        case object[:type]
        when :boolean then Types::BooleanSettingType
        when :string then Types::StringSettingType
        else
          raise "Unexpected Setting: #{object[:type]}"
        end
      end
    end

    def id
      object.id.to_s.camelize(:lower)
    end

    orphan_types(
      BooleanSettingType,
      StringSettingType,
    )
  end
end
