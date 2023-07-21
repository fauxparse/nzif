module Registrations
  class Finalise < ApplicationInteractor
    delegate :registration, to: :context

    def call
      authorize! registration, to: :update?

      # ParticipantMailer.registration_confirmation(registration).deliver_later
    end
  end
end
