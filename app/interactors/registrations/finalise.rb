module Registrations
  class Finalise < ApplicationInteractor
    delegate :registration, to: :context

    def call
      authorize! registration, to: :update?

      return if registration.completed?

      registration.update!(completed_at: Time.zone.now)
      ParticipantMailer.registration_confirmation(registration).deliver_later
      update_registration_count
    end

    private

    def update_registration_count
      festival = registration.festival
      NZIFSchema.subscriptions.trigger(
        :registrations,
        { year: festival.to_param },
        { count: festival.registrations.completed.count },
      )
    end
  end
end
