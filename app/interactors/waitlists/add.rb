module Waitlists
  class Add < ApplicationInteractor
    delegate :session, :registration, :position, to: :context

    def call
      authorize! registration, to: :update?

      if session.placements.exists?(registration_id: registration.id)
        perform(Registrations::RemoveFromSession, registration:, session:)
      end

      if waitlist.new_record?
        waitlist.position = position
        waitlist.save!
      else
        waitlist.insert_at(position)
      end
    end

    def waitlist
      context.waitlist ||= session.waitlist.find_or_initialize_by(registration_id: registration.id)
    end
  end
end
