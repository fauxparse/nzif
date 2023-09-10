class PaymentPolicy < ApplicationPolicy
  def index?
    user.payments?
  end

  def create?
    user&.persisted?
  end

  def view?
    user.payments?
  end

  def update?
    view?
  end

  def manage?
    user.payments?
  end
end
