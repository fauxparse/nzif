module Payments
  class ProcessStripeEvent < ApplicationInteractor
    delegate :event, to: :context

    def call
      # we're not logged in when we get a stripe event
      skip_authorization!

      case event.type
      when 'charge.succeeded'
        handle_charge_succeeded
      else
        Rails.logger.info "Unhandled Stripe event type: #{event.type}"
      end
    end

    def registration
      context[:registration] ||= Registration.find(data.metadata.registration_id)
    end

    private

    def handle_charge_succeeded
      Add.call(
        current_user: registration.user,
        type: CreditCardPayment,
        registration:,
        state: :approved,
        amount: Money.from_cents(data.amount, data.currency),
        reference: data.id,
      )
    end

    def data
      event.data.object
    end
  end
end
