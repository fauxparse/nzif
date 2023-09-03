module Payments
  class Cancel < ApplicationInteractor
    delegate :payment, to: :context

    def call
      authorize! payment.registration, to: :manage?
      payment.update(state: :cancelled)
    end
  end
end
