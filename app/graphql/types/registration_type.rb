# frozen_string_literal: true

module Types
  class RegistrationType < Types::BaseObject
    field :cart, CartType, null: true
    field :code_of_conduct_accepted_at, GraphQL::Types::ISO8601DateTime, null: true
    field :completed_at, GraphQL::Types::ISO8601DateTime, null: true
    field :donate_discount, Boolean, null: false
    field :id, ID, null: false
    field :outstanding, MoneyType, null: false
    field :payments, [PaymentType], null: false
    field :photo_permission, Boolean, null: false
    field :preferences, [PreferenceType], null: false
    field :sessions, [SessionType], null: false
    field :show_explainer, Boolean, null: false
    field :teaching, [SessionType], null: false
    field :user, UserType, null: true
    field :waitlist, [SessionType], null: false
    field :workshops_count, Integer, null: false

    field :feedback, [FeedbackType], null: false

    field :payment_intent, PaymentIntentType, null: true do
      argument :amount, MoneyType, required: true
    end

    def id
      super || ''
    end

    def preferences
      dataloader
        .with(Sources::RegistrationPreferences, context:)
        .load(object.id)
    end

    def sessions
      dataloader
        .with(Sources::RegistrationSessions, context:)
        .load(object.id)
    end

    def waitlist
      dataloader
        .with(Sources::RegistrationWaitlist, context:)
        .load(object.id)
    end

    def workshops_count
      dataloader
        .with(Sources::WorkshopsCount, festival: object.festival, context:)
        .load(object.id)
    end

    def cart
      return nil unless current_user

      payments.then do |payments|
        ::Registrations::CalculateCartTotals.call(
          current_user: context[:current_resource],
          registration: object,
          payments:,
        )
      end
    end

    def payments
      dataloader
        .with(Sources::Payments, states: %i[pending approved], context:)
        .load(object.id)
    end

    def feedback
      dataloader
        .with(Sources::FeedbackByRegistration, context:)
        .load(object.id)
    end

    def outstanding
      account.then { |account| account&.outstanding || Money.zero }
    end

    def account
      dataloader
        .with(Sources::Accounts, context:)
        .load(object.id)
    end

    def teaching
      return [] unless object.user&.profile

      dataloader
        .with(Sources::SessionsByTutor, context:)
        .load(object.user.profile.id)
    end

    def payment_intent(amount:)
      customer = Payments::GetStripeCustomer.call(
        registration: object,
        current_user: object.user,
      ).customer

      Stripe::PaymentIntent.create(
        amount: amount.cents,
        currency: 'nzd',
        customer: customer&.id,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          registration_id: object.to_param,
        },
      )
    rescue Stripe::StripeError => e
      { error: e.message }
    end
  end
end
