module Authorization
  extend ActiveSupport::Concern

  included do
    include ActionPolicy::Behaviour
    include ActionPolicy::Behaviours::ThreadMemoized
    include ActionPolicy::Behaviours::Memoized
    include ActionPolicy::Behaviours::Namespaced
    include ActionPolicy::GraphQL::Fields

    authorize :user, through: :current_user
  end

  def current_user
    context[:current_resource]
  end
end
