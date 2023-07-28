# frozen_string_literal: true

module Types
  class RegistrationType < Types::BaseObject
    field :cart, CartType, null: false
    field :code_of_conduct_accepted_at, GraphQL::Types::ISO8601DateTime, null: true
    field :id, ID, null: false
    field :preferences, [PreferenceType], null: false
    field :user, UserType, null: true
    field :workshops_count, Integer, null: false

    def id
      super || ''
    end

    def preferences
      dataloader
        .with(Sources::RegistrationPreferences, context:)
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
      ::Registrations::CalculateCartTotals.call(current_user: context[:current_resource],
        registration: object)
    end
  end
end
