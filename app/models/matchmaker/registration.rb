module Matchmaker
  class Registration
    attr_reader :id, :name, :preferences, :activities, :placements

    def initialize(id:, name:, preferences:)
      @id = id
      @name = name
      @preferences = preferences
      @placements = {}
      @activities = Set.new
    end

    def score
      @placements.values.map { |v| 1.0 / v }.sum / [preferences.size, 1].max
    end

    delegate :zero?, to: :score

    def candidates(reload: false)
      @candidates = nil if reload
      @candidates ||= preferences.map do |slot, session_ids|
        Candidate.new(registration: self, slot:, preferences: session_ids)
      end.index_by(&:slot)
    end

    def candidate(session)
      candidates[session.starts_at]
    end

    def placed_in(session)
      @placements[session.starts_at] = (preferences[session.starts_at].index(session.id) || 0) + 1
      @activities << session.activity_id
    end

    def bump_from(session)
      @placements.delete(session.starts_at)
      @activities.delete(session.activity_id)

      candidate(session).bump(session)
    end

    def already_in?(activity_id)
      @activities.include?(activity_id)
    end

    def <=>(other)
      cmp = score <=> other.score
      return cmp unless cmp.zero?

      id <=> other.id
    end

    def as_json
      {
        id:,
        name:,
        preferences:,
      }
    end
  end
end
