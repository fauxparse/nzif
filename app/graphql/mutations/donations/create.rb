module Mutations
  module Donations
    class Create < BaseMutation
      graphql_name 'CreateDonation'

      field :donation, Types::DonationType, null: false
      field :payment_intent_secret, String, null: false

      argument :amount_cents, Integer, required: true
      argument :anonymous, Boolean, required: false, default_value: false
      argument :email, String, required: true
      argument :message, String, required: false
      argument :name, String, required: true
      argument :newsletter, Boolean, required: false, default_value: false

      def resolve(**attrs)
        create = ::Donations::Create.call(attributes: attrs)
        {
          donation: create.donation,
        }
      end
    end
  end
end
