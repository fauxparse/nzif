class SessionPolicy < ApplicationPolicy
  def manage?
    user.registrations?
  end

  def cast?
    user.activities? || user.activity_owners.exists?(activity: record.activity)
  end
end
