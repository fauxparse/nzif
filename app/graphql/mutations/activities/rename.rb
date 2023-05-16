module Mutations
  module Activities
    class Rename < BaseMutation
      graphql_name 'RenameActivity'

      field :activity, Types::ActivityType, null: false

      argument :id, GraphQL::Types::ID, required: true
      argument :name, String, required: true

      def resolve(id:, name:)
        activity = Activity.find(id)
        perform(::Activities::Rename, activity:, name:)
      end
    end
  end
end
