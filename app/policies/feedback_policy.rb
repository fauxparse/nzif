class FeedbackPolicy < ApplicationPolicy
  def save?
    record.registration.user_id == user.id &&
      record.session.placements.exists?(registration_id: record.registration.id)
  end
end
