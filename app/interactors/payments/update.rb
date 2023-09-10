module Payments
  class Update < ApplicationInteractor
    delegate :payment, :attributes, to: :context

    def call
      authorize! payment, to: :update?
      payment.update!(attributes.to_h)
    end
  end
end
