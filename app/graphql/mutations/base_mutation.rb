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

    def perform(interactor, **args)
      interactor.call(current_user:, **args)
    end
  end
end
