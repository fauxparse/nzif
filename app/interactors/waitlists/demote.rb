module Waitlists
  class Demote < ApplicationInteractor
    delegate :registration, :session, :position, to: :context

    NotInSession = Class.new(StandardError)
    AlreadyOnWaitlist = Class.new(StandardError)

    def call
      authorize! registration, to: :manage?

      registration.transaction do
        perform(::Registrations::RemoveFromSession, registration:, session:)
        session.placements.reload
        waitlist.insert_at(position)
      end
    rescue ActiveRecord::RecordNotFound
      raise NotInSession
    end

    def placement
      @placement ||= session.placements.find_by!(registration_id: registration.id)
    rescue ActiveRecord::RecordNotFound
      raise NotInSession
    end

    def waitlist
      @waitlist ||= session.waitlist.create!(registration_id: registration.id)
    rescue ActiveRecord::RecordNotUnique, ActiveRecord::RecordInvalid
      raise AlreadyOnWaitlist
    end
  end
end
