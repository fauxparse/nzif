# frozen_string_literal: true

module Types
  class RegistrationType < Types::BaseObject
    field :code_of_conduct_accepted_at, GraphQL::Types::ISO8601DateTime, null: true
    field :id, ID, null: false
    field :preferences, [PreferenceType], null: false
    field :user, UserType, null: true

    def id
      super || ''
    end

    def preferences
      dataloader
        .with(Sources::RegistrationPreferences, context:)
        .load(object.id)
    end
  end
end
