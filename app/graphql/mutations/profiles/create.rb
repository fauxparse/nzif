module Mutations
  module Profiles
    class Create < BaseMutation
      argument :attributes, Types::ProfileAttributes, required: true

      field :profile, Types::PersonType, null: false

      def resolve(attributes:)
        perform(::Profiles::Create, attributes:)
      end
    end
  end
end
