class SessionPolicy < ApplicationPolicy
  def manage?
    user.registrations?
  end
end
