module Registrations
  class RemoveFromSession < ApplicationInteractor
    delegate :session, :registration, to: :context

    def call
      authorize! registration, to: :update?

      session.placements.find_by!(registration_id: registration.id).destroy!

      # TODO: send cancellation email
    end
  end
end
