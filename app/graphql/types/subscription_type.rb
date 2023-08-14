module Types
  class SubscriptionType < GraphQL::Schema::Object
    field_class GraphqlDevise::Types::BaseField

    field :job_progress, subscription: Subscriptions::JobProgress, authenticate: false
    field :registrations, subscription: Subscriptions::Registrations, authenticate: false
  end
end
