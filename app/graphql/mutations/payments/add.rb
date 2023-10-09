module Mutations
  module Payments
    class Add < BaseMutation
      graphql_name 'AddPayment'

      field :payment, Types::PaymentType, null: false

      argument :amount, Types::MoneyType, required: true
      argument :registration_id, ID, required: true
      argument :type, Types::PaymentTypeType, required: false, default_value: InternetBankingPayment

      def resolve(registration_id:, amount:, type:)
        registration = Registration.find(registration_id)
        perform(::Payments::Add, registration:, amount:, type:)
      end
    end
  end
end
