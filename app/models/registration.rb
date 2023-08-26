class Registration < ApplicationRecord
  belongs_to :user
  belongs_to :festival
  has_one :profile, through: :user
  has_many :preferences, autosave: true, dependent: :destroy
  has_many :requested_slots, -> { distinct }, through: :preferences, source: :slot
  has_many :placements, dependent: :destroy
  has_many :sessions, through: :placements
  has_many :workshops, through: :sessions, source: :activity
  has_many :waitlist, dependent: :destroy
  has_many :payments, dependent: :destroy

  scope :completed, -> { where.not(completed_at: nil) }

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
end
