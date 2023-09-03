module Types
  class VoucherType < BaseObject
    implements PaymentType

    field :workshops, Integer, null: false
  end
end
