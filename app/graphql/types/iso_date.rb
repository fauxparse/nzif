module Types
  class ISODate < BaseScalar
    def self.coerce_input(input_value, _context)
      Date.parse(input_value)
    rescue ArgumentError
      raise GraphQL::CoercionError, "#{input_value.inspect} is not a valid Date"
    end

    def self.coerce_result(ruby_value, _context)
      ruby_value.iso8601
    end
  end
end
