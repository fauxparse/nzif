# rubocop:disable Rails/ApplicationRecord, Rails/HasManyOrHasOneDependent

class Slot < ActiveRecord::Base
  is_view dependencies: [SessionSlot]

  self.primary_key = :starts_at

  belongs_to :festival, inverse_of: :slots

  has_many :slot_activities, inverse_of: :slot, foreign_key: :starts_at
  has_many :activities, through: :slot_activities
  has_many :slot_sessions, inverse_of: :slot, foreign_key: :starts_at
  has_many :sessions, inverse_of: :slot, foreign_key: :starts_at

  def to_param
    starts_at.iso8601
  end
end

# rubocop:enable Rails/ApplicationRecord, Rails/HasManyOrHasOneDependent
