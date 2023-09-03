module Payments
  class Approve < ApplicationInteractor
    delegate :payment, to: :context

    def call
      authorize! payment.registration, to: :manage?
      payment.update(state: :approved)
    end
  end
end
