require 'rails_helper'

RSpec.describe "Festivals", type: :request do
  describe "GET /show" do
    it "returns http success" do
      get "/festivals/show"
      expect(response).to have_http_status(:success)
    end
  end

end
