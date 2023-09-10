module Types
  class PaymentAttributes < BaseInputObject
    argument :state, PaymentStateType, required: false
  end
end
