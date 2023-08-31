class Waitlist < ApplicationRecord
  belongs_to :session
  belongs_to :registration
  has_one :workshop, through: :session, source: :activity, source_type: 'Workshop'

  acts_as_list scope: %w[session_id]

  validate :not_in_session

  def offered?
    offered_at.present?
  end

  private

  def not_in_session
    return unless session.placements.exists?(registration_id:)

    errors.add(:registration_id, 'is already in this session')
  end
end
