# rubocop:disable GraphQL/ObjectDescription
module Resolvers
  class BaseResolver < GraphQL::Schema::Resolver
    include Authorization

    argument_class Types::BaseArgument
  end
end
# rubocop:enable GraphQL/ObjectDescription
