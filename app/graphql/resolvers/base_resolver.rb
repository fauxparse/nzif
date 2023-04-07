# rubocop:disable GraphQL/ObjectDescription
module Resolvers
  class BaseResolver < GraphQL::Schema::Resolver
    argument_class Types::BaseArgument
  end
end
# rubocop:enable GraphQL/ObjectDescription
