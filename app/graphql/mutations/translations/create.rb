module Mutations
  module Translations
    class Create < BaseMutation
      graphql_name 'CreateTranslation'

      field :translation, Types::TranslationType, null: false

      argument :country, Types::Country, required: true
      argument :name, String, required: true
      argument :traditional_name, String, required: true

      def resolve(...)
        perform(::Translations::Create, ...)
      end
    end
  end
end
