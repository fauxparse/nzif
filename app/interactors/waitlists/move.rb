module Waitlists
  class Move < ApplicationInteractor
    delegate :registration, :session, :position, to: :context

    NotOnWaitlist = Class.new(StandardError)

    def call
      authorize! registration, to: :manage?

      waitlist.move_to(position)
    end

    def waitlist
      @waitlist ||= session.waitlist.find_by!(registration_id: registration.id)
    rescue ActiveRecord::RecordNotFound
      raise NotOnWaitlist
    end
  end
end
