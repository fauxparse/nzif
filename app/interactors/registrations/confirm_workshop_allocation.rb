module Registrations
  class ConfirmWorkshopAllocation < ApplicationInteractor
    def call
      authorize! festival, to: :update?

      finalise_sessions
      # send_confirmations
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
      festival.transaction do
        allocation.sessions.each_value do |session|
          finalise_session(session)
        end
      end
    end

    def finalise_session(session)
      record = sessions[session.id]
      place_participants(record, session.placements)
      create_waitlist(record, session.waitlist)
    end

    def place_participants(session, placements)
      placements.each do |registration|
        session.placements.create!(registration_id: registrations[registration.id].id)
      end
    end

    def create_waitlist(session, waitlist)
      waitlist.sort_by { |r| r.score * r.preferences.size }.each do |registration|
        session.waitlist.create!(registration_id: registrations[registration.id].id)
      end
    end

    def send_confirmations
      allocation.registrations.each do |registration|
        ParticipantMailer
          .workshop_confirmation(registration: registrations[registration])
          .deliver_later
      end
    end
  end
end
