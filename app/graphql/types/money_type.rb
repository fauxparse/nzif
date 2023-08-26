module Types
  class MoneyType < BaseScalar
    def self.coerce_input(input_value, _context)
      Money.from_cents(input_value)
    rescue ArgumentError
      raise GraphQL::CoercionError, "#{input_value.inspect} is not a valid amount"
    end

    def self.coerce_result(ruby_value, _context)
      case ruby_value
      when Money then ruby_value.cents
      else ruby_value.to_i
      end
    end
  end
end
