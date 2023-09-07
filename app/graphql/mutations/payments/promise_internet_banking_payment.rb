module Mutations
  module Payments
    class PromiseInternetBankingPayment < BaseMutation
      field :payment, Types::PaymentType, null: false

      argument :amount, Types::MoneyType, required: true
      argument :registration_id, ID, required: true

      def resolve(registration_id:, amount:)
        registration = Registration.find(registration_id)
        perform(
          ::Payments::Add,
          registration:,
          amount:,
          type: InternetBankingPayment,
          state: :pending,
        )
      end
    end
  end
end
