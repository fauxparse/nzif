module Registrations
  class SendConfirmationEmail < ApplicationInteractor
    delegate :registration, to: :context

    def call
      authorize! registration, to: :update?

      email.deliver_later
    end

    def email
      return ParticipantMailer.registration_confirmation(registration:) if earlybird?

      ParticipantMailer.workshop_confirmation(registration:)
    end

    def earlybird?
      registration.festival.earlybird?
    end
  end
end
