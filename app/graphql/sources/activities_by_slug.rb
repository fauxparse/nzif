module Sources
  class ActivitiesBySlug < GraphQL::Dataloader::Source
    attr_reader :festival, :type

    def initialize(festival:, type:)
      super()
      @festival = festival
      @type = type
    end

    def fetch(slugs)
      records = festival.activities.where(type: type.to_s, slug: slugs)
      slugs.map { |slug| records.find { |r| r.slug == slug } }
    end
  end
end
