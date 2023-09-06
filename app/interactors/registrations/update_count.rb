module Registrations
  class UpdateCount < ApplicationInteractor
    delegate :registration, to: :context

    def call
      skip_authorization!
      festival = registration.festival
      NZIFSchema.subscriptions.trigger(
        :registrations,
        { year: festival.to_param },
        { count: festival.registrations.completed.count },
      )
    end
  end
end
