class Registration < ApplicationRecord
  include ActiveSnapshot

  belongs_to :user
  belongs_to :festival
  has_one :profile, through: :user
  has_many :preferences, autosave: true, dependent: :destroy
  has_many :requested_slots, through: :preferences, source: :slots
  has_many :placements, dependent: :destroy, autosave: true
  has_many :sessions, through: :placements
  has_many :workshops, through: :sessions, source: :activity
  has_many :waitlist, dependent: :destroy, autosave: true
  has_many :payments, dependent: :destroy

  scope :completed, -> { where.not(completed_at: nil) }

  has_snapshot_children do
    instance = self.class.includes(:placements, :waitlist).find(id)
    {
      sessions: instance.sessions,
      waitlist: instance.waitlist,
    }
  end

  before_destroy :destroy_snapshots

  def self.with_details_for_calendar
    includes(
      user: :profile,
      placements: { session: { activity: { cast: :profile } } },
      preferences: { session: { activity: { cast: :profile } } },
    )
  end

  def self.pricing
    Pricing.instance
  end

  def phase
    festival.registration_phase
  end

  def completed?
    completed_at&.past?
  end

  private

  def destroy_snapshots
    snapshots.destroy_all
  end
end
