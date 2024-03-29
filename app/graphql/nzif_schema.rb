class NZIFSchema < GraphQL::Schema
  use GraphqlDevise::SchemaPlugin.new(
    query: Types::QueryType,
    mutation: Types::MutationType,
    resource_loaders: [
      GraphqlDevise::ResourceLoader.new(User),
    ],
    authenticate_default: false,
  )

  use GraphQL::Subscriptions::ActionCableSubscriptions, broadcast: true, default_broadcastable: true

  mutation(Types::MutationType)
  query(Types::QueryType)
  subscription(Types::SubscriptionType)

  # For batch-loading (see https://graphql-ruby.org/dataloader/overview.html)
  use GraphQL::Dataloader

  # GraphQL-Ruby calls this when something goes wrong while running a query:
  # rubocop:disable Lint/UselessMethodDefinition
  def self.type_error(err, context)
    # if err.is_a?(GraphQL::InvalidNullError)
    #   # report to your bug tracker here
    #   return nil
    # end
    super
  end
  # rubocop:enable Lint/UselessMethodDefinition

  # Union and Interface Resolution
  def self.resolve_type(_abstract_type, _obj, _ctx)
    # TODO: Implement this method
    # to return the correct GraphQL object type for `obj`
    raise(GraphQL::RequiredImplementationMissingError)
  end

  # Stop validating when it encounters this many errors:
  validate_max_errors(100)

  max_depth 50
  max_complexity 1000

  # Relay-style Object Identification:

  # Return a string UUID for `object`
  def self.id_from_object(object, _type_definition, _query_ctx)
    # For example, use Rails' GlobalID library (https://github.com/rails/globalid):
    object.to_gid_param
  end

  # Given a string UUID, find the object
  def self.object_from_id(global_id, _query_ctx)
    # For example, use Rails' GlobalID library (https://github.com/rails/globalid):
    GlobalID.find(global_id)
  end

  rescue_from(ActiveRecord::RecordInvalid) do |error|
    errors = error.record.errors
    messages = errors.as_json.keys.index_with { |attr| errors.full_messages_for(attr) }
    raise GraphQL::ExecutionError.new(
      error.message,
      extensions: { errors: messages.as_json },
    )
  end
end
