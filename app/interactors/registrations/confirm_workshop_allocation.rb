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

    def sessions
      @sessions ||= festival
        .sessions
        .includes(:activity)
        .where(activities: { type: 'Workshop' })
        .index_by(&:to_param)
    end

    def registrations
      @registrations ||= festival
        .registrations
        .completed
        .index_by(&:to_param)
    end

    def finalise_sessions
      allocation.sessions.each_value do |session|
        finalise_session(session)
      end
    end

    def finalise_session(session)
      record = sessions[session.id]

      session.placements.each do |registration|
        record.placements.create!(registration_id: registrations[registration.id].id)
      end

      session.waitlist.sort_by { |r| r.score * r.preferences.size }.each do |registration|
        record.waitlist.create!(registration_id: registrations[registration.id].id)
      end
    end

    def send_confirmations
      allocation.registrations.each do |registration|
        ParticipantMailer.workshop_confirmation(registrations[registration]).deliver_later
      end
    end
  end
end
