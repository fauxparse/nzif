# rubocop:disable Rails/ApplicationRecord, Rails/HasManyOrHasOneDependent

class Slot < ActiveRecord::Base
  is_view

  self.primary_key = :id

  belongs_to :festival, inverse_of: :slots

  has_many :slot_activities
  has_many :activities, through: :slot_activities
  has_many :slot_sessions
  has_many :sessions, through: :slot_sessions
end

# rubocop:enable Rails/ApplicationRecord, Rails/HasManyOrHasOneDependent
