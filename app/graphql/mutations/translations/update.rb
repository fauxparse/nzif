module Mutations
  module Translations
    class Update < BaseMutation
      graphql_name 'UpdateTranslation'

      field :translation, Types::TranslationType, null: false

      argument :id, GraphQL::Types::ID, required: true
      argument :name, String, required: true
      argument :traditional_name, String, required: true

      def resolve(...)
        perform(::Translations::Update, ...)
      end
    end
  end
end
