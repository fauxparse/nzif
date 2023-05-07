class Slot < ApplicationRecord
  include Castable

  belongs_to :festival
  belongs_to :venue, optional: true
  belongs_to :activity, optional: true

  enum :activity_type

  validates :starts_at, :ends_at,
    presence: true,
    date: {
      on_or_after: -> { festival.start_date },
      on_or_before: -> { festival.end_date },
    }
  validates :ends_at, time: { after: :starts_at }
  validate :check_for_venue_clashes
  validate :check_activity_type, if: :activity_type?

  def self.overlapping(slot)
    where('starts_at < ? AND ends_at > ?', slot.ends_at, slot.starts_at).where.not(id: slot.id)
  end

  def activity_type
    super.constantize
  end

  def activity_type=(value)
    super value.to_s
  end

  def self.role_type
    :slot
  end

  def valid_cast_roles
    Castable.roles_from_config[activity_type.to_s.underscore.to_sym][:slot]&.map(&:to_sym) || []
  end

  private

  def check_for_venue_clashes
    return if venue.blank?

    clashes = festival.slots.overlapping(self).where(venue:)

    errors.add(:venue, "is already in use at #{clashes.first.starts_at}") if clashes.exists?
  end

  def check_activity_type
    return if activity.blank? || activity.is_a?(activity_type)

    errors.add(:activity_id, "should be a #{activity_type}")
  end
end
