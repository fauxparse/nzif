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

  def period
    starts_at.hour < 12 ? :am : :pm
  end

  def date_with_period
    "#{starts_at.to_date}:#{period}"
  end
end

# rubocop:enable Rails/ApplicationRecord
