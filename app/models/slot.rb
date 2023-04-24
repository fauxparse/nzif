class Slot < ApplicationRecord
  belongs_to :festival
  belongs_to :venue, optional: true

  validates :starts_at, :ends_at,
    presence: true,
    date: {
      on_or_after: -> { festival.start_date },
      on_or_before: -> { festival.end_date },
    }
  validates :ends_at, time: { after: :starts_at }
  validates :activity_type, inclusion: { in: Activity.descendants }
  validate :check_for_venue_clashes

  def self.overlapping(slot)
    where('starts_at < ? AND ends_at > ?', slot.ends_at, slot.starts_at).where.not(id: slot.id)
  end

  def activity_type
    super.constantize
  rescue NameError
    nil
  end

  def activity_type=(value)
    super value.to_s
  end

  private

  def check_for_venue_clashes
    return if venue.blank?

    clashes = festival.slots.overlapping(self).where(venue:)

    errors.add(:venue, "is already in use at #{clashes.first.starts_at}") if clashes.exists?
  end
end
