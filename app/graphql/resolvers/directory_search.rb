module Resolvers
  class DirectorySearch < Resolvers::BaseResolver
    type [Types::PersonType], null: false

    argument :query, String, required: true

    def resolve(query:)
      Profile.registered.search(query).limit(10)
    end
  end
end
