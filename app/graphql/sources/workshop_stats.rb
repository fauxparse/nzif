module Sources
  class WorkshopStats < BaseSource
    attr_reader :max

    def initialize(context:, max: Preference.maximum(:position))
      super(context:)
      @max = max
    end

    def fetch(workshop_ids)
      stats = scope.where(activity_id: workshop_ids)
        .group_by(&:activity_id)
        .transform_values do |sessions|
          h = sessions.inject(Hash.new { 0 }) do |hash, session|
            hash.update(session.position => session.count)
          end
          (1..max).map { |i| h[i] }
        end
      workshop_ids.map do |id|
        {
          id:,
          counts: stats[id] || ([0] * max),
        }
      end
    end

    private

    def scope
      Session
        .joins(preferences: :registration)
        .where.not(registrations: { completed_at: nil })
        .select(
          <<~SQL.squish,
            sessions.activity_id AS activity_id,
            preferences.position AS position,
            COUNT(preferences.id) AS count
          SQL
        )
        .group('sessions.activity_id, preferences.position')
    end
  end
end
