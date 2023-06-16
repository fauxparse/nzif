# frozen_string_literal: true

module Types
  class RegistrationType < Types::BaseObject
    field :city, PlaceNameType, null: true
    field :code_of_conduct_accepted_at, GraphQL::Types::ISO8601DateTime, null: true
    field :country, PlaceNameType, null: true
    field :id, ID, null: false
    field :person, PersonType, null: false
    field :phone, String, null: true
    field :preferences, [SlotType], null: false
    field :pronouns, String, null: true
    field :user, UserType, null: false

    def id
      super || 'new'
    end

    def preferences
      dataloader
        .with(Sources::RegistrationPreferences, context:)
        .load(object.id)
    end

    def person
      object.user&.profile || Profile.new(id: 'new')
    end
  end
end
