class ChartsController < ApplicationController
  def preferences
    respond_to do |format|
      format.json do
        render json: PreferencesChart.new(Festival.current).as_json
      end
    end
  end
end
