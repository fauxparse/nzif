module Mutations
  module People
    class Update < BaseMutation
      graphql_name 'UpdatePerson'

      field :profile, Types::PersonType, null: false

      argument :attributes, Types::PersonAttributes, required: true
      argument :id, GraphQL::Types::ID, required: true

      def resolve(id:, attributes:)
        profile = ::Profile.includes(:user).find(id)
        perform(::Profiles::Update, profile:, attributes: attributes.to_h)
      end
    end
  end
end
