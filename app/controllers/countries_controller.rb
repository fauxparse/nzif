class CountriesController < ApplicationController
  def index
    respond_to do |format|
      format.json do
        render json: CountryList.new
      end
    end
  end
end
