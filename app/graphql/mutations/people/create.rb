module Mutations
  module People
    class Create < BaseMutation
      argument :attributes, Types::PersonAttributes, required: true

      field :profile, Types::PersonType, null: false

      def resolve(attributes:)
        perform(::Profiles::Create, attributes:)
      end
    end
  end
end
