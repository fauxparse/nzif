module Types
  class DashboardType < Types::BaseObject
    class Value < Types::BaseObject
      field :current, Integer, null: false
      field :max, Integer, null: false
    end

    field :id, ID, null: false
    field :income, Value, null: false
    field :registrations, Value, null: false
    field :workshop_places, Value, null: false

    def registrations
      max = 120
      current = object.registrations.completed.count
      { current:, max: }
    end

    def workshop_places
      scope = object.sessions.where(activity_type: 'Workshop')
      max = scope.sum(:capacity)
      current = scope.sum(:placements_count)
      { current:, max: }
    end

    def income
      current = object.payments.approved.sum(:amount_cents)
      max = RegistrationTotal.where(festival: object).sum(:total)
      { current:, max: }
    end
  end
end
