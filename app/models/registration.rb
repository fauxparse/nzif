class Registration < ApplicationRecord
  belongs_to :user
  belongs_to :festival
  has_one :profile, through: :user
  has_many :preferences, autosave: true, dependent: :destroy
  has_many :requested_slots, -> { distinct }, through: :preferences, source: :slot
  has_many :placements, dependent: :destroy
  has_many :sessions, through: :placements

  def self.pricing
    @pricing ||= Hashie::Mash.new(YAML.load_file(Rails.root.join('config/pricing.yml'))['pricing'])
  end

  def phase
    festival.registration_phase
  end
end
