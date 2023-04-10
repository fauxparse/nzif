# Base class for application policies
class ApplicationPolicy < ActionPolicy::Base
  pre_check :allow_admins

  authorize :user, allow_nil: true

  private

  def user
    super || User.new
  end

  def allow_admins
    allow! if user.admin?
  end
end
