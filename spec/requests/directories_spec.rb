require 'rails_helper'

RSpec.describe "Directories", type: :request do
  describe "GET /show" do
    it "returns http success" do
      get "/directories/show"
      expect(response).to have_http_status(:success)
    end
  end

end
