module Registrations
  class CreateSnapshot < ApplicationInteractor
    delegate :registration, :current_user, :action, to: :context

    def call
      authorize! registration, to: :update?

      context.snapshot = registration.create_snapshot!(
        identifier: "#{registration.to_param}@#{Time.zone.now.iso8601}",
        user: current_user,
        metadata: {
          action:,
        },
      )
    end
  end
end
