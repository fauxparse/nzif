module Registrations
  class AddToSession < ApplicationInteractor
    delegate :session, :registration, to: :context

    def call
      authorize! registration, to: :update?

      session.placements.create_or_find_by!(registration_id: registration.id)
      session.waitlist.where(registration_id: registration.id).destroy_all
      remove_from_other_sessions
      remove_from_waitlists

      # TODO: send confirmation email
    end

    private

    def other_sessions_in_slot
      @other_sessions_in_slot ||= session.slot.sessions.where.not(id: session.id)
    end

    def remove_from_other_sessions
      registration.placements.where(session: other_sessions_in_slot).destroy_all
    end

    def preferences
      @preferences ||= registration.preferences
        .joins(:session)
        .where(sessions: { starts_at: session.starts_at })
    end

    def remove_from_waitlists
      granted = preferences.detect { |p| p.session_id == session.id }

      return unless granted

      sessions = preferences.select { |p| p.position >= granted.position }

      registration.waitlist.destroy_by(session_id: sessions.map(&:session_id))
    end
  end
end
