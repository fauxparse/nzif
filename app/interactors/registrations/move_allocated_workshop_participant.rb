module Registrations
  class MoveAllocatedWorkshopParticipant < ApplicationInteractor
    delegate :allocation, :registration_id, :old_session_id, :new_session_id, :waitlist,
      to: :context

    def call
      authorize! Registration, to: :update?

      return if noop?

      remove_from_old_session if old_session.present? && !waitlist
      add_to_new_session if new_session.present?
      # allocation.update!(data: matchmaker)
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
      @registration ||= matchmaker.registrations.find { |r| r.id == registration_id }
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
      old_session&.remove(candidate)

      return unless !new_position || old_position < new_position

      old_session.waitlist << candidate
    end

    def add_to_new_session
      if waitlist
        new_session.candidates.delete(candidate)
        new_session.waitlist << candidate
      else
        new_session.waitlist.delete(candidate)
        new_session.candidates << candidate
      end
    end

    def find_position(session_id)
      id = Session.decode_id(session_id)
      candidate.preferences.find { |p| p.session_id == id }&.position
    end

    def noop?
      waitlist_different = (!old_position && waitlist) || (old_position && !waitlist)
      return true if old_session_id == new_session_id && waitlist_different
      return true if !old_session_id && !new_session_id

      false
    end
  end
end
