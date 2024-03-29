class GraphqlController < ApplicationController
  # If accessing from outside this domain, nullify the session
  # This allows for outside API access while preventing CSRF attacks,
  # but you'll have to authenticate your user separately
  protect_from_forgery with: :null_session if Rails.env.development?

  def execute
    variables = prepare_variables(params[:variables])
    query = params[:query]
    operation_name = params[:operationName]
    context = gql_devise_context(User)
    context[:current_user] = context[:current_resource]
    result = NZIFSchema.execute(query, variables:, context:, operation_name:)
    render json: result
  rescue StandardError => e
    raise e unless Rails.env.development?

    handle_error_in_development(e)
  end

  private

  # Handle variables in form data, JSON body, or a blank value
  def prepare_variables(variables_param)
    case variables_param
    when String then (variables_param.present? && JSON.parse(variables_param)) || {}
    when Hash then variables_param
    # GraphQL-Ruby will validate name and type of incoming variables.
    when ActionController::Parameters then variables_param.to_unsafe_hash
    when nil then {}
    else raise ArgumentError, "Unexpected parameter: #{variables_param}"
    end
  end

  def handle_error_in_development(error)
    logger.error error.message
    logger.error error.backtrace.join("\n")

    render json: { errors: [{ message: error.message, backtrace: error.backtrace }], data: {} },
      status: :internal_server_error
  end
end
