class Preference < ApplicationRecord
  belongs_to :registration
  belongs_to :session
  has_one :workshop, through: :session, source: :activity

  before_validation :set_position, unless: :position?
  before_create :push_others
  after_destroy :pull_others

  validates :position, presence: true

  def overlapping_preferences
    registration.preferences
      .joins(session: :session_slots)
      .merge(SessionSlot.overlapping(session))
  end

  private

  def set_position
    return unless registration && session

    self.position = (overlapping_preferences.maximum(:position) || 0) + 1
  end

  def push_others
    overlapping_preferences.find_each do |p|
      p.update!(position: p.position + 1) if p.position >= position
    end
  end

  def pull_others
    overlapping_preferences.find_each do |p|
      p.update!(position: p.position - 1) if p.position >= position
    end
  end
end
