module Types
  class SessionType < Types::BaseObject
    field :activity, ActivityType, null: true
    field :activity_type, ActivityTypeType, null: false
    field :capacity, Integer, null: true
    field :count, Integer, null: false, method: :placements_count
    field :ends_at, GraphQL::Types::ISO8601DateTime, null: false
    field :id, ID, null: false
    field :participants, [RegistrationType], null: false
    field :slot, SlotType, null: false
    field :starts_at, GraphQL::Types::ISO8601DateTime, null: false
    field :venue, VenueType, null: true
    field :waitlist, [WaitlistType], null: false
    field :workshop, WorkshopType, null: true

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

    def activity
      dataloader
        .with(Sources::Simple, context:, model: ::Activity)
        .load(Activity.encode_id(object.activity_id))
    end

    def workshop
      object.activity_type == Workshop ? activity : nil
    end

    def slot
      dataloader
        .with(Sources::Simple, context:, model: ::Slot, primary_key: :starts_at)
        .load(object.starts_at)
    end
  end
end
