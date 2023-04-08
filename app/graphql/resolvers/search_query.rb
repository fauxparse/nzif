module Resolvers
  class SearchQuery < Resolvers::BaseResolver
    type [Types::SearchResultType], null: false

    description 'Search for content across the app'

    argument :limit, Integer, required: false, description: 'Maximum number of results to return'
    argument :query, String, required: true, description: 'Text to search for'

    def resolve(query:, limit: 5)
      activity_matches(query:, limit:) + page_matches(query:, limit:)
    end

    private

    def activity_matches(query:, limit:)
      Activity.search_activities(query).includes(:festival).limit(limit).map do |activity|
        Hashie::Mash.new(activity:)
      end
    end

    def page_matches(query:, limit:)
      contentful.entries(content_type: 'page', query:, include: limit).map do |entry|
        Hashie::Mash.new(slug: entry.slug, title: entry.title, lede: content_field(entry, :lede))
      end
    end

    def contentful
      @contentful ||= Contentful::Client.new(
        access_token: Rails.application.credentials.contentful[:token],
        space: Rails.application.credentials.contentful[:space],
        dynamic_entries: :auto,
        raise_errors: true,
      )
    end

    def content_field(entry, field)
      flatten_content(entry.fields[field])
    end

    def flatten_content(content)
      return nil if content.blank?

      if content['nodeType'] == 'text'
        content['value']
      elsif content['content']
        content['content'].map { |c| flatten_content(c) }.join(' ')
      end
    end
  end
end
