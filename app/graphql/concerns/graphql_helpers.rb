module GraphqlHelpers
  extend ActiveSupport::Concern

  def current_festival
    # context[:current_festival] ||= Festival.upcoming.first
    context[:current_festival] ||= Festival.order(starts_at: :desc).first
  end

  def current_registration
    context[:current_registration] =
      current_user&.registrations&.includes(:festival)&.find_by(festival: current_festival)
  end
end
