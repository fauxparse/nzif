class Waitlist < ApplicationRecord
  belongs_to :session
  belongs_to :registration
  has_one :workshop, through: :session, source: :activity, source_type: 'Workshop'

  acts_as_list scope: %w[session_id]

  validate :not_in_session

  def offered?
    offered_at.present?
  end

  def move_to(new_position)
    return if new_position == position

    low, high, direction = [*[new_position, position].sort, position <=> new_position]

    acts_as_list_list
      .where('position >= ? AND position <= ?', low, high)
      .update_all( # rubocop:disable Rails/SkipsModelValidations
        Waitlist.sanitize_sql_array(
          [
            'position = CASE WHEN position = ? THEN ? ELSE position + ? END',
            position, new_position, direction
          ],
        ),
      )

    self.position = new_position
  end

  private

  def not_in_session
    return unless session.placements.exists?(registration_id:)

    errors.add(:registration_id, 'is already in this session')
  end
end
