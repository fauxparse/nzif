module Types
  class PaymentIntentType < Types::BaseObject
    field :client_secret, String, null: true
    field :error, String, null: true

    def error
      object.try(:error)
    end
  end
end
