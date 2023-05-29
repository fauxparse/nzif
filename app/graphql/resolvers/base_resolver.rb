module Resolvers
  class BaseResolver < GraphQL::Schema::Resolver
    include Authorization

    argument_class Types::BaseArgument
  end
end
