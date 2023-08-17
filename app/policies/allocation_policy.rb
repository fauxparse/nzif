class AllocationPolicy < ApplicationPolicy
  def index?
    user.registrations?
  end

  def create?
    user.registrations?
  end

  def view?
    user.registrations?
  end

  def update?
    user.registrations?
  end

  def manage?
    user.registrations?
  end
end
