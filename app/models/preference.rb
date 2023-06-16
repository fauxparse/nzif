class Preference < ApplicationRecord
  belongs_to :registration
  belongs_to :slot
  has_one :workshop, through: :slot, source: :activity

  acts_as_list scope: %w[registration_id starts_at]

  before_validation :set_starts_at

  validates :starts_at, presence: true

  private

  def set_starts_at
    self.starts_at = slot.starts_at
  end
end
