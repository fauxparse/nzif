class Preference < ApplicationRecord
  belongs_to :registration
  belongs_to :session
  has_one :workshop, through: :session, source: :activity

  acts_as_list scope: %w[registration_id starts_at]

  before_validation :set_starts_at

  validates :starts_at, presence: true

  private

  def set_starts_at
    self.starts_at = session.starts_at
  end
end
