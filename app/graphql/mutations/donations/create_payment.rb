module Mutations
  module Donations
    class CreatePayment < BaseMutation
      graphql_name 'CreateDonationPayment'

      field :donation, Types::DonationType, null: false
      field :payment_intent_secret, String, null: false

      argument :id, GraphQL::Types::ID, required: true

      def resolve(id:)
        create = ::Donations::CreatePaymentIntent.call(donation: Donation.find(id))
        {
          donation: create.donation,
          payment_intent_secret: create.payment_intent.client_secret,
        }
      end
    end
  end
end
