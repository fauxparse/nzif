module Types
  module PaymentType
    include BaseInterface

    field :id, ID, null: false
    field :amount, MoneyType, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :state, PaymentStateType, null: false

    definition_methods do
      def resolve_type(object, _context)
        case object
        when CreditCardPayment then Types::CreditCardPaymentType
        when InternetBankingPayment then Types::InternetBankingPaymentType
        when Voucher then Types::VoucherType
        else
          raise "Unexpected Payment: #{object.inspect}"
        end
      end
    end

    def state
      object.state.to_sym
    end

    orphan_types(
      CreditCardPaymentType,
      InternetBankingPaymentType,
      VoucherType,
    )
  end
end
