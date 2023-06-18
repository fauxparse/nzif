class RegistrationPolicy < ApplicationPolicy
  def index?
    user.registrations?
  end

  def create?
    user&.persisted?
  end

  def update?
    user.registrations? || record.new_record? || (user.id == record.user_id)
  end

  def manage?
    user.registrations?
  end

  scope_for :relation do |relation|
    next relation if user.registrations?

    relation.where(user_id: user.id)
  end
end
