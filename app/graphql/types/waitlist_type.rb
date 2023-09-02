module Types
  class WaitlistType < BaseObject
    field :id, ID, null: false
    field :offered_at, GraphQL::Types::ISO8601DateTime, null: true
    field :position, Integer, null: false
    field :registration, RegistrationType, null: false
    field :session, SessionType

    def session
      dataloader
        .with(Sources::Simple, model: ::Session, context:)
        .load(object.session_id)
    end
  end
end
