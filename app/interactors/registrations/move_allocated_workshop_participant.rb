module Registrations
  class MoveAllocatedWorkshopParticipant < ApplicationInteractor
    delegate :allocation, :registration_id, :old_session_id, :new_session_id, :waitlist,
      to: :context

    def call
      authorize! Registration, to: :update?

      data = allocation.original.deep_symbolize_keys
      remove_from_old_session(data) if old_session_id.present?
      add_to_new_session(data) if new_session_id.present?
      allocation.update!(data:)
    end

    private

    def registration
      context[:registration] ||= Registration.includes(:preferences).find(registration_id)
    end

    def remove_from_old_session(data)
      session = data[:sessions].find { |s| s[:id] == old_session_id }
      session[:registrations].delete(registration_id)

      old_position = find_position(old_session_id)
      new_position = find_position(new_session_id)

      return unless !new_position || old_position < new_position

      session[:waitlist].push(registration_id)
    end

    def add_to_new_session(data)
      session = data[:sessions].find { |s| s[:id] == new_session_id }
      if waitlist
        session[:waitlist].push(registration_id) unless session[:waitlist].include?(registration_id)
      else
        session[:waitlist].delete(registration_id)
        session[:registrations].push(registration_id)
      end
    end

    def find_position(session_id)
      registration.preferences.find { |p| p.session_id == session_id }&.position
    end
  end
end
