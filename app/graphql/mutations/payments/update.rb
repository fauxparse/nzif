module Mutations
  module Payments
    class Update < BaseMutation
      graphql_name 'UpdatePayment'

      field :payment, Types::PaymentType, null: false

      argument :attributes, Types::PaymentAttributes, required: true
      argument :id, ID, required: true

      def resolve(id:, attributes:)
        payment = ::Payment.find(id)
        perform(::Payments::Update, payment:, attributes:)
      end
    end
  end
end
