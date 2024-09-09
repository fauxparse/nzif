module Donations
  class CreatePaymentIntent < ApplicationInteractor
    delegate :donation, to: :context

    def call
      skip_authorization!

      payment_intent
    end

    def payment_intent
      context[:payment_intent] ||= Stripe::PaymentIntent.create(
        amount: donation.amount.cents,
        currency: 'nzd',
        customer: customer['id'],
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          donation_id: donation.to_param,
        },
      )
    end

    def customer
      context[:customer] ||= Stripe::Customer.create(
        name: donation.name,
        email: donation.email,
      )
    end
  end
end
