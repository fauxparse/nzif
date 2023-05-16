module Types
  class VenueResultType < Types::BaseObject
    implements Types::SearchResultType

    field :venue, VenueType, null: false

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
