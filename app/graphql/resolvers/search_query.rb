module Resolvers
  class SearchQuery < Resolvers::BaseResolver
    type [Types::SearchResultType], null: false

    argument :activity_type, Types::ActivityTypeType, required: false
    argument :limit, Integer, required: false
    argument :only, [Types::SearchTypeType], required: false,
      default_value: %i[activity person venue page]
    argument :query, String, required: true

    def resolve(query:, only:, activity_type: nil, limit: 10)
      @activity_type = activity_type

      only.flat_map do |type|
        send("#{type}_matches", query:, limit:)
      end
    end

    private

    attr_reader :activity_type

    def activity_matches(query:, limit:)
      (
        activity_scope.search(query).limit(limit) +
        people_activity_matches(query:, limit:)
      ).uniq.map { |activity| Hashie::Mash.new(activity:) }
    end

    def people_activity_matches(query:, limit:)
      profile_ids = Profile.search(query).pluck(:id)
      return [] if profile_ids.empty?

      activity_scope
        .joins(:cast).references(:cast)
        .where(cast: { profile_id: profile_ids })
        .limit(limit)
    end

    def activity_scope
      scope = authorized_scope(Activity, type: :relation)
      scope = scope.by_type(activity_type) if activity_type.present?
      scope
    end

    def person_matches(query:, limit:)
      return [] unless allowed_to?(:index?, Profile)

      authorized_scope(Profile, type: :relation).search(query).limit(limit).map do |person|
        Hashie::Mash.new(person:)
      end
    end

    def venue_matches(query:, limit:)
      Venue.search(query).limit(limit).map do |venue|
        Hashie::Mash.new(venue:)
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
