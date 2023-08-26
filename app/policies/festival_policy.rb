class FestivalPolicy < ApplicationPolicy
  def update?
    user.admin?
  end

  def manage?
    user.admin?
  end
end
