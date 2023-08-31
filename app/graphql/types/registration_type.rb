# frozen_string_literal: true

module Types
  class RegistrationType < Types::BaseObject
    field :cart, CartType, null: true
    field :code_of_conduct_accepted_at, GraphQL::Types::ISO8601DateTime, null: true
    field :completed_at, GraphQL::Types::ISO8601DateTime, null: true
    field :id, ID, null: false
    field :payments, [PaymentType], null: false
    field :preferences, [PreferenceType], null: false
    field :sessions, [SessionType], null: false
    field :user, UserType, null: true
    field :waitlist, [SessionType], null: false
    field :workshops_count, Integer, null: false

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
      # TODO: use dataloader here
      if object.festival.registration_phase == :earlybird
        object.requested_slots.count
      else
        object.workshops.count
      end
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
  end
end
