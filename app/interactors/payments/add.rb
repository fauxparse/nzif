module Payments
  class Add < ApplicationInteractor
    delegate :registration, :amount, :type, to: :context

    def call
      authorize! registration, to: :manage?
      payment
    end

    def payment
      context[:payment] ||= type.create!(
        registration:,
        amount:,
        state: :approved,
      )
    end
  end
end
