module Mutations
  module Payments
    class Add < BaseMutation
      graphql_name 'AddPayment'

      field :payment, Types::PaymentType, null: false

      argument :amount, Types::MoneyType, required: true
      argument :created_at, GraphQL::Types::ISO8601DateTime, required: false
      argument :registration_id, ID, required: true
      argument :state, Types::PaymentStateType, required: false, default_value: :approved
      argument :type, Types::PaymentTypeType, required: false, default_value: InternetBankingPayment

      def resolve(registration_id:, amount:, type:, state:, created_at: Time.zone.now)
        registration = Registration.find(registration_id)
        perform(::Payments::Add, registration:, amount:, type:, state:, created_at:)
      end
    end
  end
end
