module Mutations
  class BaseMutation < GraphQL::Schema::Mutation
    include Authorization
    include ResolverCallbacks
    include GraphqlHelpers

    argument_class Types::BaseArgument
    field_class Types::BaseField
    object_class Types::BaseObject

    def current_festival
      context[:current_festival] ||= Festival.current
    end

    def current_registration
      context[:current_registration] =
        current_user&.registrations&.includes(:festival)
          &.find_or_initialize_by(festival: current_festival)
    end

    def find_registration(id: nil)
      id ? Registration.find(id) : current_registration
    end

    def perform(interactor, **args)
      interactor.call(current_user:, **args)
    end
  end
end
