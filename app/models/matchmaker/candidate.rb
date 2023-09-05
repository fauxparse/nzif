module Matchmaker
  class Candidate
    attr_reader :registration, :preferences, :slot, :position

    def initialize(registration:, preferences:, slot:)
      @registration = registration
      @preferences = preferences
      @slot = slot
      @position = 1
    end

    delegate :id, to: :registration

    def session_id
      preferences[position - 1]
    end

    def next_non_clashing_session(sessions)
      @position += 1 while session_id && registration.already_in?(sessions[session_id].activity_id)

      session_id && sessions[session_id]
    end

    def bump(session)
      @position += 1 if session_id == session.id
      session_id && self
    end

    delegate :present?, to: :session_id
  end
end
