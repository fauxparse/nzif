module Types
  module SearchResultType
    include BaseInterface

    field :id, ID, null: false
    field :title, String, null: false
    field :description, String, null: true
    field :url, String, null: false

    definition_methods do
      def resolve_type(object, _context)
        if object.activity? then ActivityResultType
        elsif object.person? then PersonResultType
        elsif object.venue? then VenueResultType
        elsif object.slug? then PageResultType
        else
          raise "Unexpected Activity: #{object.inspect}"
        end
      end
    end

    orphan_types(
      ActivityResultType,
      PageResultType,
      PersonResultType,
      VenueResultType,
    )
  end
end
