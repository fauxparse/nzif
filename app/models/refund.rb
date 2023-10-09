class Refund < Payment
  validates :amount_cents, numericality: { less_than: 0 }
end
