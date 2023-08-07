module Types
  class SubscriptionType < GraphQL::Schema::Object
    field_class GraphqlDevise::Types::BaseField

    field :registrations, subscription: Subscriptions::Registrations, authenticate: false
  end
end
