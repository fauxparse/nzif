module Mutations
  module Profiles
    class Create < BaseMutation
      description 'Create a user profile'

      argument :attributes, Types::ProfileAttributes, required: true,
        description: 'Attributes for the new profile'

      field :profile, Types::PersonType, null: false,
        description: 'The newly created profile'

      def resolve(attributes:)
        perform(::Profiles::Create, attributes:)
      end
    end
  end
end
