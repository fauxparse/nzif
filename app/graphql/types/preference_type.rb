module Types
  class PreferenceType < Types::BaseObject
    field :id, ID, null: false
    field :position, Integer, null: false
    field :session, SessionType, null: false
    field :session_id, ID, null: false
    field :workshop, WorkshopType, null: false
    field :workshop_id, ID, null: false

    def session_id
      Session.encode_id(object.session_id)
    end

    def session
      dataloader
        .with(Sources::Simple, context:, model: ::Session)
        .load(object.session_id)
    end

    def workshop
      dataloader
        .with(Sources::Simple, context:, model: ::Workshop)
        .load(::Workshop.encode_id(object.session.activity_id))
    end
  end
end
