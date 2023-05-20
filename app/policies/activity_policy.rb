class ActivityPolicy < ApplicationPolicy
  def index?
    true
  end

  def create?
    user.activities?
  end

  def manage?
    user.activities? || record.cast.joins(profile: :user).exists?(users: { id: user.id })
  end

  scope_for(:relation, &:itself)
end
