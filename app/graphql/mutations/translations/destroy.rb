module Mutations
  module Translations
    class Destroy < BaseMutation
      graphql_name 'DestroyTranslation'

      payload_type Boolean

      argument :id, GraphQL::Types::ID, required: true

      def resolve(id:)
        perform(::Translations::Destroy, id:).success?
      end
    end
  end
end
