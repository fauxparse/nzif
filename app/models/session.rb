class Session < ApplicationRecord
  include Castable
  include Messageable

  belongs_to :festival
  belongs_to :venue, optional: true
  belongs_to :activity, optional: true
  has_one :slot_activity # rubocop:disable Rails/HasManyOrHasOneDependent
  belongs_to :slot, class_name: 'Slot', foreign_key: :starts_at, inverse_of: :sessions,
    optional: true
  has_many :preferences, dependent: :destroy
  has_many :placements, dependent: :destroy
  has_many :participants, through: :placements, source: :registration
  has_many :waitlist, -> { order(position: :asc) }, dependent: :destroy, inverse_of: :session
  has_many :feedback, dependent: :destroy
  has_many :hidden_sessions, dependent: :destroy
  has_many :session_slots # rubocop:disable Rails/HasManyOrHasOneDependent

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

  after_create :update_session_slots
  after_update :update_session_slots,
    if: -> { saved_change_to_starts_at? || saved_change_to_ends_at? }
  after_destroy :update_session_slots

  def self.overlapping(session)
    where('starts_at < ? AND ends_at > ?', session.ends_at, session.starts_at)
      .where.not(id: session.id)
  end

  def activity_type
    super.constantize
  end

  def activity_type=(value)
    super(value.to_s)
  end

  def self.role_type
    :session
  end

  def valid_cast_roles
    Castable.roles_from_config[activity_type.to_s.underscore.to_sym][:session]&.map(&:to_sym) || []
  end

  def message_recipients
    placements.includes(registration: :user).map { |p| p.registration.user }
  end

  def sessions
    [self]
  end

  def show?
    activity_type == Show
  end

  def workshop?
    activity_type == Workshop
  end

  def social_event?
    activity_type == SocialEvent
  end

  def conference?
    activity_type == Conference
  end

  def slots
    first_slot = Slot.new(
      id: starts_at,
      starts_at:,
      ends_at: starts_at + 3.hours,
    )
    if ends_at > slot.ends_at
      [first_slot, Slot.new(
        starts_at: ends_at - 3.hours,
        ends_at:,
      )]
    else
      [first_slot]
    end
  end

  def full?
    capacity.present? && placements_count >= capacity
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

  def update_session_slots
    SessionSlot.refresh_view!
  end
end
