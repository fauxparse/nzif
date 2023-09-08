module Waitlists
  class Promote < ApplicationInteractor
    delegate :session, :registration, to: :context

    NotOnWaitlist = Class.new(StandardError)

    def call
      authorize! :session, to: :manage?

      session.placements.create!(registration:)
      waitlist.destroy!
      remove_from_other_sessions
      remove_from_waitlists
      send_notification
    end

    def waitlist
      @waitlist ||= session.waitlist.find_by!(registration_id: registration.id)
    rescue ActiveRecord::RecordNotFound
      raise NotOnWaitlist
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

    def send_notification
      # TODO: Send notification
      registration.reload
    end
  end
end
