module Types
  class VenueResultType < Types::BaseObject
    implements Types::SearchResultType

    description 'A search result from a venue'

    field :venue, VenueType, null: false, description: 'Venue'

    def id
      "venue[#{venue.to_param}]"
    end

    def title
      venue.name
    end

    def description
      venue.address
    end

    def url
      "/venues/#{venue.to_param}"
    end

    delegate :venue, to: :object
  end
end
