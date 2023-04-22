module Types
  module SearchResultType
    include BaseInterface

    description 'An individual search result'

    field :id, ID, null: false, description: 'Unique ID'
    field :title, String, null: false, description: 'Title of result page'
    field :description, String, null: true, description: 'Supporting description'
    field :url, String, null: false, description: 'Link to result page'

    definition_methods do
      def resolve_type(object, _context)
        if object.activity? then ActivityResultType
        elsif object.user? then UserResultType
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
      UserResultType,
      VenueResultType,
    )
  end
end
