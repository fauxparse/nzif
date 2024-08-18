class Donation < ApplicationRecord
  enum :state, :payment_state

  monetize :amount_cents

  validates :name, :email, presence: true
  validates :amount_cents, numericality: { greater_than: 0 }
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }
end
