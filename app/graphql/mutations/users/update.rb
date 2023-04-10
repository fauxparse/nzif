module Mutations
  module Users
    class Update < BaseMutation
      description 'Update a user'

      field :user, Types::UserType, null: false,
        description: 'The updated user'

      argument :attributes, Types::UserAttributes, required: true,
        description: 'Attributes to update'
      argument :id, ID, required: false,
        description: 'The ID of the user to update'

      def resolve(attributes:, id: current_user&.id)
        user = User.find(id)

        perform(::Users::Update, user:, attributes:)

        { user: }
      end
    end
  end
end
