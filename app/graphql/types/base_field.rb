module Types
  class BaseField < GraphQL::Schema::Field
    include ActionPolicy::GraphQL::AuthorizedField
    include GraphqlDevise::FieldAuthentication

    argument_class Types::BaseArgument
  end
end
