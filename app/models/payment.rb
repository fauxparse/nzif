class Payment < ApplicationRecord
  belongs_to :registration

  enum :state, :payment_state

  monetize :amount_cents

  def self.types
    @types ||= PostgresEnum[:payment_type].values.map { |s| s.to_s.constantize }
  end

  def policy_class
    PaymentPolicy
  end
end
