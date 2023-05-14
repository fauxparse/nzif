module Mutations
  module Activities
    class Move < BaseMutation
      description 'Move an activity'

      graphql_name 'MoveActivity'

      field :activity, Types::ActivityType, null: false, description: 'Moved activity'

      argument :id, GraphQL::Types::ID, required: true, description: 'ID of activity to move'
      argument :slug, String, required: true, description: 'New slug'

      def resolve(id:, slug:)
        activity = Activity.find(id)
        perform(::Activities::Move, activity:, slug:)
      end
    end
  end
end
