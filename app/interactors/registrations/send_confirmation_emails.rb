module Registrations
  class SendConfirmationEmails < ApplicationInteractor
    delegate :festival, to: :context
    delegate :registrations, to: :festival

    def call
      authorize! festival, to: :update?

      registrations.each do |registration|
        ParticipantMailer.workshop_confirmation(registration:).deliver_now
      end
    end
  end
end
