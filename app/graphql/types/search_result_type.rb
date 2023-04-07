module Types
  module SearchResultType
    include BaseInterface

    description 'An individual search result'

    field :id, ID, null: false, description: 'Unique ID'
    field :excerpt, String, null: true, description: 'Relevant excerpt of the result'

    definition_methods do
      def resolve_type(object, _context)
        raise "Unexpected Activity: #{object.inspect}" if object.slug.blank?

        PageResultType
      end
    end

    orphan_types(
      PageResultType,
    )
  end
end
