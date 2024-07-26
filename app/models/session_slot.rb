# rubocop:disable Rails/ApplicationRecord

class SessionSlot < ActiveRecord::Base
  is_view materialized: true

  def self.overlapping(session)
    where(
      'session_slots.starts_at < ? AND session_slots.ends_at > ?',
      session.ends_at,
      session.starts_at,
    )
  end
end

# rubocop:enable Rails/ApplicationRecord
