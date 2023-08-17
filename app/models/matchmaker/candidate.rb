module Matchmaker
  class Candidate
    attr_reader :preferences, :registration, :slot, :choice

    def initialize(registration, slot, preferences)
      @registration = registration
      @slot = slot
      @preferences = preferences.sort_by(&:position)
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
      if registration.score == other.registration.score
        registration.id <=> other.registration.id
      else
        registration.score <=> other.registration.score
      end
    end

    def eql?(other)
      id == other.id
    end

    delegate :empty?, to: :preferences

    delegate :id, to: :registration
  end
end
