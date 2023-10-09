module Types
  class PaymentTypeType < BaseEnum
    Payment.types.each do |type|
      value type.name, type.name, value: type
    end
  end
end
