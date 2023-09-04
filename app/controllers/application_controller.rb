class ApplicationController < ActionController::Base
  include GraphqlDevise::SetUserByToken

  private

  def current_user
    gql_devise_context(User)[:current_resource]
  end
end
