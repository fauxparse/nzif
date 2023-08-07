module Subscriptions
  class Registrations < BaseSubscription
    argument :year, GraphQL::Types::ID, required: true

    field :count, Integer, null: false

    def subscribe(year:)
      { count: Festival.find(year).registrations.completed.count }
    end
  end
end
