# Base class for application policies
class ApplicationPolicy < ActionPolicy::Base
  pre_check :allow_admins

  default_rule :manage?

  authorize :user, allow_nil: true

  alias_rule :index?, :create?, :update?, :destroy?, to: :manage?

  private

  def user
    super || User.new
  end

  def allow_admins
    allow! if user.admin?
  end
end
