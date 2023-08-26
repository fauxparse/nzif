module Matchmaker
  class Candidate
    attr_reader :preferences, :registration, :slot, :choice

    def initialize(registration, slot, preferences)
      @registration = registration
      @slot = slot
      @preferences = preferences.sort_by(&:position)
    end

    def record_id
      registration.registration.id
    end

    def place(sessions, &)
      preference = preferences.shift
      @choice = preference.position
      registration.offer(slot, choice)
      session_id = ::Session.encode_id(preference.session_id)
      sessions[session_id].place(self, &)
    end

    def bump_from(_session)
      registration.revoke(slot)
    end

    def <=>(other)
      as = registration.score
      bs = other.registration.score
      if as < bs
        -1
      else
        return -1 if as == bs && registration.candidates.size < other.registration.candidates.size

        1
      end
    end

    def eql?(other)
      id == other.id
    end

    delegate :empty?, to: :preferences

    delegate :id, :score, to: :registration
  end
end
