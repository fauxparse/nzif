class ActivityPolicy < ApplicationPolicy
  def index?
    true
  end

  def create?
    user.admin?
  end

  def manage?
    user.admin?
  end

  scope_for(:relation, &:itself)
end
