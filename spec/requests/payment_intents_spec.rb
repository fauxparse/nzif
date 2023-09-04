require 'rails_helper'

RSpec.describe "PaymentIntents", type: :request do
  describe "GET /create" do
    it "returns http success" do
      get "/payment_intents/create"
      expect(response).to have_http_status(:success)
    end
  end

end
