module Registrations
  class MarkAsCompleted < ApplicationInteractor
    delegate :registration, to: :context

    def call
      authorize! registration, to: :update?

      registration.update!(completed_at: Time.zone.now)
      context[:action] = 'finalise'
    end
  end
end
