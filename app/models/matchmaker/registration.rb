module Matchmaker
  class Registration
    attr_reader :allocation, :id, :name, :preferences, :activities, :placements

    def initialize(allocation:, id:, name:, preferences:)
      @allocation = allocation
      @id = id
      @name = name
      @preferences = preferences.transform_values { |v| v.transform_keys(&:to_i) }
      @placements = {}
      @activities = Set.new
    end

    def score
      [@placements.values.map { |v| 1.0 / v }.sum / [preferences.size, 1].max, 1].min
    end

    delegate :zero?, to: :score

    def candidates(reload: false)
      @candidates = nil if reload
      @candidates ||= preferences.map do |slot, session_ids|
        Candidate.new(registration: self, slot:, preferences: session_ids)
      end.index_by(&:slot)
    end

    def placed?(session, position)
      session.slots.any? { |slot| placements.key?(slot) && placements[slot] <= position }
    end

    def preference_for(session)
      preferences[session.slots.first].invert[session.id]
    end

    def prefers?(session)
      preference_for(session).present?
    end

    def candidates_for(session)
      session.slots.map { |slot| candidates[slot] }
    end

    def placed_in(session)
      session.slots.each do |slot|
        position = preferences[slot].invert[session.id]
        @placements[slot] = position if position
      end
      @activities << session.activity_id
    end

    def bump_from(session)
      session.slots.each do |slot|
        @placements.delete(slot)
      end
      @activities.delete(session.activity_id)

      candidates_for(session).map { |c| c.bump(session) }.compact
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
