module Mutations
  module Payments
    class Approve < BaseMutation
      graphql_name 'ApprovePayment'

      argument :id, ID, required: true

      field :payment, Types::PaymentType, null: false

      def resolve(id:)
        payment = Payment.find(id)
        perform(::Payments::Approve, payment:)
      end
    end
  end
end
