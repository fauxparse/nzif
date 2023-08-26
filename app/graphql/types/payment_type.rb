module Types
  module PaymentType
    include BaseInterface

    field :id, ID, null: false
    field :amount, MoneyType, null: false

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

    orphan_types(
      CreditCardPaymentType,
      InternetBankingPaymentType,
      VoucherType,
    )
  end
end
