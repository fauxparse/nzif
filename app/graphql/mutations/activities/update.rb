module Mutations
  module Activities
    class Update < BaseMutation
      graphql_name 'UpdateActivity'

      field :activity, Types::ActivityType, null: false

      argument :attributes, Types::ActivityAttributes, required: true
      argument :id, GraphQL::Types::ID, required: true

      def resolve(id:, attributes:)
        activity = Activity.find(id)
        perform(::Activities::Update, activity:, attributes:)
      end
    end
  end
end
