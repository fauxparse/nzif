class Registration < ApplicationRecord
  belongs_to :user
  belongs_to :festival

  has_many :preferences, autosave: true, dependent: :destroy
  has_many :requested_slots, -> { distinct }, through: :preferences, source: :slot
end
