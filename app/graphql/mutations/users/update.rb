module Mutations
  module Users
    class Update < BaseMutation
      graphql_name 'UpdateUser'

      field :user, Types::UserType, null: false

      argument :attributes, Types::UserAttributes, required: true
      argument :id, ID, required: false

      def resolve(attributes:, id: current_user&.id)
        user = User.find(id)

        perform(::Users::Update, user:, attributes:)

        { user: }
      end
    end
  end
end
