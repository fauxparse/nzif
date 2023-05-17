module Mutations
  module Profiles
    class Update < BaseMutation
      graphql_name 'UpdateProfile'

      field :profile, Types::PersonType, null: false

      argument :attributes, Types::ProfileAttributes, required: true
      argument :id, GraphQL::Types::ID, required: true

      def resolve(id:, attributes:)
        profile = ::Profile.find(id)
        perform(::Profiles::Update, profile:, attributes: attributes.to_h)
      end
    end
  end
end
