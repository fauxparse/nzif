module Registrations
  class CreateSnapshot < ApplicationInteractor
    delegate :registration, :current_user, :action, to: :context

    def call
      authorize! registration, to: :update?

      reloaded = Registration.includes(:placements, :waitlist).find(registration.id)

      context.snapshot = reloaded.create_snapshot!(
        user: current_user,
        metadata: {
          action:,
        },
      )
    end
  end
end
