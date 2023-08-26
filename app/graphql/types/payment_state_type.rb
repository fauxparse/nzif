module Types
  class PaymentStateType < BaseEnum
    PostgresEnum[:payment_state].each_value do |s|
      value s.to_s.camelize, s.to_s.humanize, value: s.to_sym
    end
  end
end
