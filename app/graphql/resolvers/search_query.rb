module Resolvers
  class SearchQuery < Resolvers::BaseResolver
    type [Types::SearchResultType], null: false

    description 'Search for content across the app'

    argument :limit, Integer, required: false, description: 'Maximum number of results to return'
    argument :query, String, required: true, description: 'Text to search for'

    def resolve(query:, limit: 5)
      contentful.entries(content_type: 'page', query:, include: limit).map do |entry|
        Hashie::Mash.new(slug: entry.slug)
      end
    end

    private

    def contentful
      @contentful ||= Contentful::Client.new(
        access_token: Rails.application.credentials.contentful[:token],
        space: Rails.application.credentials.contentful[:space],
        dynamic_entries: :auto,
        raise_errors: true,
      )
    end
  end
end
