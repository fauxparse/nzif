module Payments
  class Add < ApplicationInteractor
    delegate :registration, :amount, :type, :reference, :state, to: :context

    def call
      authorize! registration, to: :update?
      payment.update!(created_at: context[:created_at]) if context[:created_at].present?
      payment
    end

    def payment
      context[:payment] ||= type.find_or_create_by!(
        registration:,
        amount_cents: amount.cents,
        state: state || :approved,
        reference:,
      )
    end
  end
end
