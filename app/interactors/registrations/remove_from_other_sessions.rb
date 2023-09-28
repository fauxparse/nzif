module Registrations
  class RemoveFromOtherSessions < ApplicationInteractor
    delegate :registration, :session, to: :context

    def call
      authorize! registration, to: :update?
      context[:sessions] = placements.map(&:session)
      remove_from_other_sessions
      remove_from_waitlists
    end

    private

    def placements
      context[:placements] ||=
        registration.placements
          .includes(:session, :registration)
          .where(session_id: other_sessions_in_slot.map(&:id))
    end

    def remove_from_other_sessions
      placements.each do |placement|
        perform(
          RemoveFromSession,
          session: placement.session,
          registration:,
          current_user: User.automaton,
          suppress_notifications: true,
          promote: true,
        )
      end
    end

    def remove_from_waitlists
      registration.waitlist.where(session: [session, *lower_priority_sessions]).destroy_all
    end

    def other_sessions_in_slot
      @other_sessions_in_slot ||=
        session.slot.sessions.where.not(id: session.id)
    end

    def preferences_in_slot
      @preferences_in_slot ||=
        registration.preferences
          .includes(:session)
          .references(:sessions)
          .where(sessions: { starts_at: session.starts_at })
    end

    def session_priority
      @session_priority ||=
        preferences_in_slot.detect { |p| p.session_id == session.id }&.position
    end

    def lower_priority_sessions
      @lower_priority_sessions ||=
        if session_priority
          preferences_in_slot.select do |p|
            p.position >= session_priority
          end.map(&:session)
        else
          []
        end
    end
  end
end
