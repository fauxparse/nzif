module Mutations
  module Payments
    class AddVoucher < BaseMutation
      field :voucher, Types::VoucherType, null: false

      argument :registration_id, ID, required: true
      argument :workshops, Integer, required: true

      def resolve(registration_id:, workshops:)
        registration = Registration.find(registration_id)
        perform(::Payments::AddVoucher, registration:, workshops:)
      end
    end
  end
end
