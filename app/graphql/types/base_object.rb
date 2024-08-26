module Types
  class BaseObject < GraphQL::Schema::Object
    # include Action Policy behaviour and its extensions
    include ActionPolicy::Behaviour
    include ActionPolicy::Behaviours::ThreadMemoized
    include ActionPolicy::Behaviours::Memoized
    include ActionPolicy::Behaviours::Namespaced

    edge_type_class(Types::BaseEdge)
    connection_type_class(Types::BaseConnection)
    field_class Types::BaseField

    # define authorization context
    authorize :user, through: :current_user

    def current_festival
      context[:current_festival] ||= Festival.current
    end

    # add a method helper to get the current_user from the context
    def current_user
      context[:current_user]
    end

    # extend the field class to add `authorize` and `authorized_scope` options
    field_class.prepend(ActionPolicy::GraphQL::AuthorizedField)

    # add `expose_authorization_rules` macro
    include ActionPolicy::GraphQL::Fields

    def id
      return object[:id] if object.is_a?(Hash)

      object.to_param
    end
  end
end
