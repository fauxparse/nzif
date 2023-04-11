class UserPolicy < ApplicationPolicy
  def index?
    user.admin?
  end

  def update?
    user.admin? || (user.id == record.id)
  end

  scope_for :relation do |relation|
    next relation if user.admin?

    # Don't list users at all if you're not an admin
    relation.where('1 = 0')
  end

  scope_for :data, :attributes do |data, with_record: nil|
    next data if user.admin? && user.id != with_record&.id

    data.except(:roles)
  end
end
