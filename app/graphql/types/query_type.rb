module Types
  class QueryType < Types::BaseObject
    # Add `node(id: ID!) and `nodes(ids: [ID!]!)`
    include GraphQL::Types::Relay::HasNodeField
    include GraphQL::Types::Relay::HasNodesField

    # Add root-level fields here.
    # They will be entry points for queries on your schema.

    field :test_field, String, null: false
    def test_field
      'Hello World!'
    end

    field :now, GraphQL::Types::ISO8601DateTime, null: false
    def now
      Time.zone.now
    end
  end
end
