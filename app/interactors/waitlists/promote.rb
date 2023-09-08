module Waitlists
  class Promote < ApplicationInteractor
    delegate :session, :registration, to: :context

    NotOnWaitlist = Class.new(StandardError)

    def call
      authorize! :session, to: :manage?

      session.placements.create!(registration:)
      waitlist.destroy!
      # TODO: remove from other sessions in the same slot
      # and update other waitlists by preference
      send_notification
    end

    def waitlist
      @waitlist ||= session.waitlist.find_by!(registration_id: registration.id)
    rescue ActiveRecord::RecordNotFound
      raise NotOnWaitlist
    end

    private

    def send_notification
      # TODO: Send notification
    end
  end
end
