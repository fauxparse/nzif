module Resolvers
  class BaseResolver < GraphQL::Schema::Resolver
    include Authorization

    argument_class Types::BaseArgument

    def current_festival
      # context[:current_festival] ||= Festival.upcoming.first
      context[:current_festival] ||= Festival.order(start_date: :desc).first
    end
  end
end
