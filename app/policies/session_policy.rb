class SessionPolicy < ApplicationPolicy
  def manage?
    user.registrations?
  end

  def cast?
    user.activities? || user.activity_owners.exists?(session: record, role: %i[director tutor])
  end

  def message?
    cast?
  end
end
