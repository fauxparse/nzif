module Registrations
  class ConfirmWorkshopAllocation < ApplicationInteractor
    def call
      authorize! festival, to: :update?

      finalise_sessions
      send_confirmations
    end

    def festival
      @festival ||= context.allocation.festival
    end

    def allocation
      @allocation ||= context.allocation.data
    end

    private

    def finalise_sessions
      allocation.sessions.each_value do |session|
        finalise_session(session)
      end
    end

    def finalise_session(session)
      record = session.session

      session.candidates.each do |candidate|
        record.placements.create!(registration_id: candidate.record_id)
      end

      session.waitlist.sort_by { |c| c.score * c.registration.preferences.size }.each do |candidate|
        record.waitlist.create!(registration_id: candidate.record_id)
      end
    end

    def send_confirmations
      allocation.registrations.each do |registration|
        ParticipantMailer.workshop_confirmation(registration.registration).deliver_later
      end
    end
  end
end
