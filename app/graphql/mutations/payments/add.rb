module Mutations
  module Payments
    class Add < BaseMutation
      graphql_name 'AddPayment'

      field :payment, Types::PaymentType, null: false

      argument :amount, Types::MoneyType, required: true
      argument :registration_id, ID, required: true

      def resolve(registration_id:, amount:)
        registration = Registration.find(registration_id)
        perform(::Payments::Add, registration:, amount:, type: InternetBankingPayment)
      end
    end
  end
end
