class Session < ApplicationRecord
  include Castable

  belongs_to :festival
  belongs_to :venue, optional: true
  belongs_to :activity, optional: true
  has_one :slot_activity # rubocop:disable Rails/HasManyOrHasOneDependent
  belongs_to :slot, class_name: 'Slot', foreign_key: :starts_at, inverse_of: :sessions,
    optional: true
  has_many :preferences, dependent: :destroy

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

  def self.overlapping(session)
    where('starts_at < ? AND ends_at > ?', session.ends_at, session.starts_at)
      .where.not(id: session.id)
  end

  def activity_type
    super.constantize
  end

  def activity_type=(value)
    super value.to_s
  end

  def self.role_type
    :session
  end

  def valid_cast_roles
    Castable.roles_from_config[activity_type.to_s.underscore.to_sym][:session]&.map(&:to_sym) || []
  end

  private

  def check_for_venue_clashes
    return if venue.blank?

    clashes = festival.sessions.overlapping(self).where(venue:)

    errors.add(:venue, "is already in use at #{clashes.first.starts_at}") if clashes.exists?
  end

  def check_activity_type
    return if activity.blank? || activity.is_a?(activity_type)

    errors.add(:activity_id, "should be a #{activity_type}")
  end
end
