module Registrations
  class UpdateWorkshopChoices < ApplicationInteractor
    delegate :registration, :session_ids, :waitlist_ids, to: :context

    def call
      authorize! registration, to: :update?

      registration.transaction do
        remove_old_placements
        remove_old_waitlists
        add_new_waitlists
        registration.save!

        add_new_sessions
      end
    end

    private

    def remove_old_placements
      current_placements.each do |placement|
        next if placed_ids.include?(placement.session.to_param)

        perform(
          RemoveFromSession,
          registration:,
          session: placement.session,
          promote: true,
          suppress_notifications: true,
        )
      end
    end

    def remove_old_waitlists
      current_waitlist.each do |waitlist|
        waitlist.destroy! unless waitlisted_ids.include?(waitlist.session.to_param)
      end
    end

    def add_new_sessions
      new_sessions.each do |session|
        perform(
          AddToSession,
          registration:,
          session:,
          suppress_notifications: true,
        )
      end
    end

    def add_new_waitlists
      new_waitlist.each do |session|
        registration.waitlist.build(session:)
      end
    end

    def current_placements
      @current_placements ||= registration.placements.includes(:session)
    end

    def current_waitlist
      @current_waitlist ||= registration.waitlist.includes(:session)
    end

    def new_sessions
      @new_sessions ||= find_sessions(
        placed_ids - Session.encode_id(current_placements.map(&:session_id)),
      )
    end

    def new_waitlist
      @new_waitlist ||= find_sessions(
        waitlisted_ids - Session.encode_id(current_waitlist.map(&:session_id)),
      )
    end

    def find_sessions(ids)
      return [] if ids.empty?

      Session.find(ids.to_a)
    end

    def placed_ids
      @placed_ids ||= Set.new(session_ids)
    end

    def waitlisted_ids
      @waitlisted_ids ||= Set.new(waitlist_ids)
    end
  end
end
