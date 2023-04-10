module Sources
  class ActivitiesBySlug < BaseSource
    attr_reader :festival, :type

    def initialize(context:, festival:, type:)
      super(context:)
      @festival = festival
      @type = type
    end

    def fetch(slugs)
      records = festival.activities.where(type: type.to_s, slug: slugs)
      slugs.map { |slug| records.find { |r| r.slug == slug } }
    end
  end
end
