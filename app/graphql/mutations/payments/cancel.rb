module Mutations
  module Payments
    class Cancel < BaseMutation
      graphql_name 'CancelPayment'

      argument :id, ID, required: true

      field :payment, Types::PaymentType, null: false

      def resolve(id:)
        payment = Payment.find(id)
        perform(::Payments::Cancel, payment:)
      end
    end
  end
end
