module Types
  class FestivalType < Types::BaseObject
    field :id, ID, null: false

    field :activities, [Types::ActivityType], null: false do
      argument :type, Types::ActivityTypeType, required: false
    end
    field :activity, Types::ActivityType, null: true do
      argument :slug, String, required: true
      argument :type, Types::ActivityTypeType, required: true
    end
    field :activity_counts, [Types::ActivityCountType], null: false
    field :balance, Types::BalanceType, null: false
    field :earlybird_closes_at, GraphQL::Types::ISO8601DateTime, null: true
    field :earlybird_opens_at, GraphQL::Types::ISO8601DateTime, null: true
    field :end_date, Types::ISODate, null: false
    field :general_opens_at, GraphQL::Types::ISO8601DateTime, null: true
    field :payments, [Types::PaymentType]
    field :people, [Types::PersonType], null: false
    field :registration_phase, Types::RegistrationPhaseType, null: false
    field :registrations, [Types::RegistrationType], null: false do
      argument :name, String, required: false
    end
    field :session, Types::SessionType, null: false do
      argument :id, ID, required: true
    end
    field :slots, [Types::SlotType], null: false do
      argument :type, Types::ActivityTypeType, required: false
    end
    field :start_date, Types::ISODate, null: false
    field :state, Types::FestivalStateType, null: false
    field :team_members, [Types::UserType], null: false
    field :timetable, Types::TimetableType, null: false
    field :venues, [Types::VenueType], null: false
    field :workshop_allocation, Types::WorkshopAllocationType, null: true
    field :workshop_pricing, Types::PricingType, null: false
    field :workshop_total, Types::MoneyType, null: false
    field :workshops, [Types::WorkshopType], null: false

    def id
      object.start_date.year.to_s
    end

    def activities(type: nil)
      dataloader
        .with(Sources::ActivitiesByFestival, context:, type:)
        .load(object.id)
    end

    def workshops
      dataloader
        .with(Sources::ActivitiesByFestival, context:, type: Workshop, scheduled_only: true)
        .load(object.id)
    end

    def activity(type:, slug:)
      dataloader
        .with(Sources::ActivitiesBySlug, context:, festival: object, type:)
        .load(slug)
    end

    def timetable
      object
    end

    def venues
      dataloader
        .with(Sources::VenuesByFestival, context:)
        .load(object.id)
    end

    def registrations(name: nil)
      dataloader
        .with(Sources::Registrations, context:, name:)
        .load(object.id)
    end

    def slots(type: nil)
      scope = object.slots.order(starts_at: :asc)
      scope = scope.joins(sessions: :activity).where(activities: { type: type.to_s }) if type
      scope.distinct
    end

    def workshop_allocation
      Allocation.find_by(festival: object)
    end

    def payments
      object.payments.includes(registration: :user)
    end

    def balance
      object
    end

    def session(id:)
      dataloader
        .with(Sources::Simple, context:, model: Session)
        .load(Session.decode_id(id))
    end

    def activity_counts
      Activity.descendants.map do |type|
        { type:, festival: object }
      end
    end

    def people
      dataloader
        .with(Sources::FestivalPresenters, context:)
        .load(object.id)
    end

    def workshop_pricing
      Registration::Pricing.instance
    end

    def team_members
      User.with_permission(:team_member)
    end
  end
end
