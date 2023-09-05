module Registrations
  class MoveAllocatedWorkshopParticipant < ApplicationInteractor
    delegate :allocation, :registration_id, :old_session_id, :new_session_id, :waitlist,
      to: :context

    def call
      authorize! Registration, to: :update?

      return if noop?

      remove_from_old_session if old_session.present? && !waitlist
      add_to_new_session if new_session.present?
      update_waitlists unless waitlist
      allocation.save!
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

    def old_position
      @old_position ||= find_position(old_session_id)
    end

    def new_position
      @new_position ||= find_position(new_session_id)
    end

    def remove_from_old_session
      old_session&.remove(registration)

      return unless !new_position || old_position < new_position

      old_session.waitlist << registration
    end

    def add_to_new_session
      if waitlist
        new_session.remove(registration)
        new_session.waitlist << registration
      else
        new_session.waitlist.delete(registration)
        new_session.placements << registration
      end
    end

    def find_position(session_id)
      candidate.preferences.find_index(session_id)&.succ
    end

    def update_waitlists
      position = find_position(new_session_id)
      sessions = matchmaker.siblings(new_session || old_session).index_by(&:id)
      prefs = candidate.preferences.zip(1..candidate.preferences.size).to_h
      sessions.each_pair do |id, session|
        next unless prefs[id]

        if !position || prefs[id] < position
          session.waitlist << registration
        else
          session.waitlist.delete(registration)
        end
      end
    end

    def noop?
      waitlist_different = (!old_position && waitlist) || (old_position && !waitlist)
      return true if old_session_id == new_session_id && waitlist_different
      return true if !old_session_id && !new_session_id

      false
    end
  end
end
