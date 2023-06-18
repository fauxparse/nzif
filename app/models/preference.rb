class Preference < ApplicationRecord
  belongs_to :registration
  belongs_to :session
  has_one :workshop, through: :session, source: :activity
  belongs_to :slot, primary_key: :starts_at

  acts_as_list scope: %w[registration_id slot_id]

  before_validation :set_slot_id, if: :session_id_changed?

  def set_slot_id
    self.slot_id = session&.starts_at
  end
end
