module Donations
  class Create < ApplicationInteractor
    delegate :attributes, to: :context

    def call
      skip_authorization!

      donation.save!

      Newsletter::Subscribe.call(name: donation.name, email: donation.email) if donation.newsletter?
      payment_intent
    end

    def donation
      context[:donation] ||= Donation.new(attributes)
    end

    def customer
      context[:customer] ||= Stripe::Customer.create(
        name: donation.name,
        email: donation.email,
      )
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
  end
end
