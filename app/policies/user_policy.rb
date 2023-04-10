class UserPolicy < ApplicationPolicy
  def update?
    user.admin? || (user.id == record.id)
  end

  scope_for :data, :attributes do |data, with_record: nil|
    next data if user.admin? && user.id != with_record&.id

    data.except(:roles)
  end
end
