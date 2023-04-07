# rubocop:disable GraphQL/ObjectDescription
module Mutations
  class BaseMutation < GraphQL::Schema::Mutation
    argument_class Types::BaseArgument
    field_class Types::BaseField
    object_class Types::BaseObject

    def current_user
      context[:current_resource]
    end
  end
end
# rubocop:enable GraphQL/ObjectDescription
