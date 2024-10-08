module Types
  module PaymentType
    include BaseInterface

    field :id, ID, null: false
    field :amount, MoneyType, null: false
    field :type, PaymentTypeType, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :state, PaymentStateType, null: false
    field :reference, String, null: false
    field :registration, RegistrationType, null: false

    definition_methods do
      def resolve_type(object, _context)
        case object
        when CreditCardPayment then Types::CreditCardPaymentType
        when InternetBankingPayment then Types::InternetBankingPaymentType
        when Voucher then Types::VoucherType
        when Refund then Types::RefundType
        else
          raise "Unexpected Payment: #{object.inspect}"
        end
      end
    end

    def state
      object.state.to_sym
    end

    def reference
      object.reference.to_s
    end

    def registration
      dataloader
        .with(Sources::Simple, model: Registration, context:)
        .load(object.registration_id)
    end

    def type
      object.class
    end

    orphan_types(
      CreditCardPaymentType,
      InternetBankingPaymentType,
      VoucherType,
      RefundType,
    )
  end
end
