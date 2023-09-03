module Payments
  class AddVoucher < ApplicationInteractor
    delegate :registration, :workshops, to: :context

    def call
      authorize! registration, to: :manage?
      context[:voucher] = Voucher.create!(registration:, workshops:, state: :approved)
    end
  end
end
