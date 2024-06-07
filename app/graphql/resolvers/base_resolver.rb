module Resolvers
  class BaseResolver < GraphQL::Schema::Resolver
    include Authorization

    argument_class Types::BaseArgument

    def current_festival
      context[:current_festival] ||= Festival.current
    end
  end
end
