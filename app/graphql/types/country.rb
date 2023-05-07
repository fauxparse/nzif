module Types
  class Country < BaseScalar
    description 'A country'

    def self.coerce_input(input_value, _context)
      ISO3166::Country[input_value] ||
        raise(GraphQL::CoercionError, "#{input_value.inspect} is not a valid country code")
    end

    def self.coerce_result(ruby_value, _context)
      ruby_value.alpha2
    end
  end
end
