module Mutations
  module Activities
    class Move < BaseMutation
      graphql_name 'MoveActivity'

      field :activity, Types::ActivityType, null: false

      argument :id, GraphQL::Types::ID, required: true
      argument :slug, String, required: true

      def resolve(id:, slug:)
        activity = Activity.find(id)
        perform(::Activities::Move, activity:, slug:)
      end
    end
  end
end
