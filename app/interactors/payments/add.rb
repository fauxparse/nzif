module Payments
  class Add < ApplicationInteractor
    delegate :registration, :amount, :type, :reference, :state, to: :context

    def call
      # authorize! registration, to: :manage?
      skip_authorization!
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
