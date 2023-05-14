module Mutations
  module Activities
    class Update < BaseMutation
      description 'Update an activity'

      graphql_name 'UpdateActivity'

      field :activity, Types::ActivityType, null: false,
        description: 'The newly updated activity'

      argument :attributes, Types::ActivityAttributes, required: true,
        description: 'Attributes for the new activity'
      argument :id, GraphQL::Types::ID, required: true,
        description: 'ID of the activity to update'

      def resolve(id:, attributes:)
        activity = Activity.find(id)
        perform(::Activities::Update, activity:, attributes:)
      end
    end
  end
end
