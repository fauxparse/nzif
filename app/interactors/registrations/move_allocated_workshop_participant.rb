module Registrations
  class MoveAllocatedWorkshopParticipant < ApplicationInteractor
    delegate :allocation, :registration_id, :old_session_id, :new_session_id, :waitlist,
      to: :context

    def call
      authorize! Registration, to: :update?

      if to_waitlist?
        move_to_waitlist
      elsif new_session
        add_to_new_session
      elsif old_session
        remove_from(old_session)
      end

      allocation.save!
    end

    def affected_sessions
      context[:affected_sessions] ||= Set.new
    end

    private

    def matchmaker
      allocation.data.deep_dup
    end

    def candidate
      @candidate ||= registration.candidate(new_session || old_session)
    end

    def registration
      @registration ||= matchmaker.registrations[registration_id]
    end

    def old_session
      @old_session ||= matchmaker.sessions[old_session_id]
    end

    def new_session
      @new_session ||= matchmaker.sessions[new_session_id]
    end

    def within_same_session?
      old_session.present? && old_session == new_session
    end

    def from_waitlist?
      !waitlist &&
        within_same_session? &&
        old_session.waitlist.include?(registration)
    end

    def to_waitlist?
      waitlist &&
        within_same_session? &&
        old_session.placements.include?(registration)
    end

    def remove_from(session)
      return if session.placements.exclude?(registration)

      session.placements.delete(registration)
      affected_sessions << session

      if new_session.blank?
        session.waitlist << registration

        session.conflicting_sessions.each do |other|
          if registration.prefers?(other) && other.waitlist.exclude?(registration)
            other.waitlist << registration
            affected_sessions << other
          end
        end
      else
        new_position = registration.preference_for(new_session)

        if registration.preference_for(session) <= new_position &&
           session.waitlist.exclude?(registration)
          session.waitlist << registration
        end
      end
    end

    def add_to_new_session
      return if new_session.blank?

      new_position = registration.preference_for(new_session)

      return if new_position.blank?

      new_session.conflicting_sessions.each do |session|
        unless session.placements.include?(registration) || session.waitlist.include?(registration)
          next
        end

        session.placements.delete(registration)

        if registration.preference_for(session) <= new_position
          session.waitlist << registration unless session.waitlist.include?(registration)
        else
          session.waitlist.delete(registration)
        end
        affected_sessions << session
      end

      new_session.waitlist.delete(registration)
      new_session.placements << registration
      affected_sessions << new_session
    end

    def move_to_waitlist
      new_session.placements.delete(registration)
      new_session.waitlist << registration
      affected_sessions << new_session
    end
  end
end
