module Registrations
  class AddToSession < ApplicationInteractor
    delegate :session, :registration, to: :context

    def call
      authorize! registration, to: :update?

      session.placements.create_or_find_by!(registration_id: registration.id)
      session.waitlist.where(registration_id: registration.id).destroy_all

      # TODO: send confirmation email
    end
  end
end
