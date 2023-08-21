module Matchmaker
  class Registration
    attr_reader :registration, :slots, :bummed_out

    delegate :empty?, to: :candidates
    delegate :preferences, to: :registration

    def initialize(registration)
      @registration = registration
      @slots = {}
      @bummed_out = 0
    end

    def id
      registration.to_param
    end

    def candidates(reload: false)
      @candidates = nil if reload
      @candidates ||= preferences.group_by(&:slot)
        .map { |slot, prefs| Candidate.new(self, slot, prefs) }
        .index_by(&:slot)
      @candidates.values
    end

    def candidate(session)
      candidates
      @candidates[session.slot]
    end

    def offer(slot, position)
      slots[slot.id] = position
    end

    def revoke(slot)
      slots.delete(slot.id)
      @bummed_out += 1 if @candidates[slot].empty?
    end

    def score
      slots.values.map { |v| 1.0 / v }.sum / [slots.size, 1].max
    end

    def session_position(session)
      preferences.find { |p| p.session_id == ::Session.decode_id(session.id) }&.position
    end

    def to_s
      registration.profile.name
    end
  end
end
