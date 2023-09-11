module Payments
  class Add < ApplicationInteractor
    delegate :registration, :amount, :type, :reference, :state, to: :context

    def call
      authorize! registration, to: :update?
      payment
    end

    def payment
      context[:payment] ||= type.create!(
        registration:,
        amount:,
        state: state || :approved,
        reference:,
      )
    end
  end
end
