module Matchmaker
  class Candidate
    attr_reader :registration, :preferences, :slot, :position

    def initialize(registration:, preferences:, slot:)
      @registration = registration
      @preferences = preferences
      @slot = slot
      @position = preferences.keys.min
    end

    delegate :id, :allocation, :placed?, to: :registration

    def session_id
      preferences[position]
    end

    def session
      session_id && allocation.sessions[session_id]
    end

    def next_session
      @position += 1 while session && placed?(session, position)
      session
    end

    def bump(session)
      @position = preferences.keys.find { |p| p > position } if session_id == session.id
      session_id && self
    end

    delegate :present?, to: :session_id
  end
end
