module Sources
  class ActivityCounts < BaseSource
    attr_reader :festival

    def initialize(context:, festival:)
      super(context:)
      @festival = festival
    end

    def fetch(activity_types)
      counts = festival.activities
        .joins('INNER JOIN sessions ON sessions.activity_id = activities.id')
        .group('activities.type')
        .pluck(:type, Arel.sql('COUNT(DISTINCT activities.id)'))
        .to_h
        .transform_keys(&:constantize)

      activity_types.map { |type| counts[type] || 0 }
    end
  end
end
