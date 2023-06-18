module Mutations
  class BaseMutation < GraphQL::Schema::Mutation
    include Authorization
    include ResolverCallbacks

    argument_class Types::BaseArgument
    field_class Types::BaseField
    object_class Types::BaseObject

    def current_user
      context[:current_resource]
    end

    def current_festival
      context[:current_festival] ||= Festival.upcoming.first
    end

    def current_registration
      context[:current_registration] =
        current_user&.registrations&.includes(:festival)&.find_by(festival: current_festival)
    end

    def perform(interactor, **args)
      interactor.call(current_user:, **args)
    end
  end
end
