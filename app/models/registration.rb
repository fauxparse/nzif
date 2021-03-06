class Registration < ApplicationRecord
  include Hashid::Rails

  belongs_to :festival
  belongs_to :user

  # Skip validation when saving these (very simple) records so that bulk updates work
  # Feels risky but there's a unique index on the table so it should be fine?
  has_many :preferences, dependent: :destroy, autosave: true, validate: false
  has_many :availability,
    class_name: 'Availability',
    dependent: :destroy,
    autosave: true,
    validate: false
  has_many :placements, dependent: :destroy, autosave: true
  has_many :sessions, through: :placements
  has_many :waitlists, dependent: :destroy, autosave: true
  has_many :payments, dependent: :destroy
  has_many :calendar_exclusions, dependent: :destroy

  enum state: {
    pending: 'pending',
    complete: 'complete',
  }

  validates :festival_id, uniqueness: { scope: :user_id }, on: :update
  validates :code_of_conduct, acceptance: true, if: :requires_acceptance?

  before_save :set_completed_at, if: %i(state_changed? complete?)

  scope :with_preferences, -> { includes(preferences: { session: :activity }) }
  scope :with_placements, -> { includes(placements: { session: :activity }) }
  scope :with_payments, -> { includes(:payments) }
  scope :with_user, -> { includes(:user) }

  def code_of_conduct_accepted?
    code_of_conduct_accepted_at.present?
  end

  def code_of_conduct_accepted=(value)
    self.code_of_conduct_accepted_at = value.present? ? Time.zone.now : nil
  end

  # TODO: These are the 2019 prices, future years will need an admin UI
  PRICES = [
    0,
    5500,
    10500,
    15000,
    19500,
    23500,
    27000,
    30000,
    32500,
    35000,
    37000,
    39000,
    40000,
  ].freeze

  def prices
    @prices ||=
      festival
        .prices
        .select { |p| p.activity_type == 'Workshop' }
        .inject({ 0 => 0 }) do |hash, price|
          hash.update(price.quantity => price.amount_cents)
        end
  end

  def cart
    @cart ||= Cart.new(self)
  end

  alias code_of_conduct code_of_conduct_accepted?

  private

  def requires_acceptance?
    code_of_conduct_accepted_at_changed? || complete?
  end

  def set_completed_at
    self.completed_at ||= Time.now
  end
end
