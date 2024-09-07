module Types
  class SessionType < Types::BaseObject
    field :activity, ActivityType, null: true
    field :activity_type, ActivityTypeType, null: false
    field :capacity, Integer, null: true
    field :count, Integer, null: false, method: :placements_count
    field :ends_at, GraphQL::Types::ISO8601DateTime, null: false
    field :full, Boolean, null: false, method: :full?
    field :id, ID, null: false
    field :participants, [RegistrationType], null: false
    field :slot, SlotType, null: false
    field :slots, [SlotType], null: false
    field :starts_at, GraphQL::Types::ISO8601DateTime, null: false
    field :venue, VenueType, null: true
    field :waitlist, [RegistrationType], null: false
    field :workshop, WorkshopType, null: true

    field :hosts, [PersonType], null: false
    field :musos, [PersonType], null: false
    field :operators, [PersonType], null: false
    field :performers, [PersonType], null: false

    field :messages, [MessageType], null: false

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

    def slots
      dataloader
        .with(Sources::SessionSlots, context:)
        .load(object.id)
    end

    def cast
      dataloader
        .with(Sources::ActivityCast, context:, activity_type: 'Session')
        .load(object.id)
    end

    def hosts
      cast.then { |cast| cast.select(&:host?).map(&:profile) }
    end

    def performers
      cast.then { |cast| cast.select(&:performer?).map(&:profile) }
    end

    def musos
      cast.then { |cast| cast.select(&:muso?).map(&:profile) }
    end

    def operators
      cast.then { |cast| cast.select(&:operator?).map(&:profile) }
    end

    def messages
      dataloader.with(Sources::SessionMessages, context:).load(object.id)
    end
  end
end
