module Resolvers
  class Translations < Resolvers::BaseResolver
    type [Types::TranslationType], null: false

    def resolve
      Placename.all
    end
  end
end
