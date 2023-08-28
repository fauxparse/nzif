module Types
  class SessionType < Types::BaseObject
    field :activity, ActivityType, null: true
    field :activity_type, ActivityTypeType, null: false
    field :capacity, Integer, null: true
    field :ends_at, GraphQL::Types::ISO8601DateTime, null: false
    field :id, ID, null: false
    field :participants, [RegistrationType], null: false
    field :starts_at, GraphQL::Types::ISO8601DateTime, null: false
    field :venue, VenueType, null: true
    field :waitlist, [RegistrationType], null: false

    def participants
      dataloader
        .with(Sources::SessionParticipants, context:)
        .load(object.id)
    end

    def waitlist
      dataloader
        .with(Sources::SessionWaitlist, context:)
        .load(object.id)
    end
  end
end
