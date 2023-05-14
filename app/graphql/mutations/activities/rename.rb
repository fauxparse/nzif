module Mutations
  module Activities
    class Rename < BaseMutation
      description 'Rename an activity'

      graphql_name 'RenameActivity'

      field :activity, Types::ActivityType, null: false, description: 'Renamed activity'

      argument :id, GraphQL::Types::ID, required: true, description: 'ID of activity to rename'
      argument :name, String, required: true, description: 'New name'

      def resolve(id:, name:)
        activity = Activity.find(id)
        perform(::Activities::Rename, activity:, name:)
      end
    end
  end
end
