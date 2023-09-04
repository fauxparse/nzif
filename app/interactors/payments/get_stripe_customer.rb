module Payments
  class GetStripeCustomer < ApplicationInteractor
    delegate :registration, to: :context

    def call
      authorize! registration, to: :update?
      return if customer.id == registration.stripe_customer_id

      registration.update!(stripe_customer_id: customer.id)
    end

    def customer
      context[:customer] ||= existing_customer || new_customer
    end

    private

    def existing_customer
      return nil if registration.stripe_customer_id.blank?

      Stripe::Customer.retrieve(registration.stripe_customer_id)
    rescue Stripe::StripeError
      nil
    end

    def new_customer
      Stripe::Customer.create(
        name: registration.user.profile.name,
        email: registration.user.email,
        phone: registration.user.profile.phone,
        metadata: {
          registration_id: registration.id,
        },
      )
    end
  end
end
