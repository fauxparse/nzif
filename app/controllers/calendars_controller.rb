class CalendarsController < ApplicationController
  def show
    user = User.find(params[:id])
    festival = Festival.current

    calendar = PersonalCalendar.new(festival:, user:)

    respond_to do |format|
      format.ics { render plain: calendar.to_ical }
    end
  end
end
