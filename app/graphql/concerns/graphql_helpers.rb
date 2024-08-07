module GraphqlHelpers
  extend ActiveSupport::Concern

  def current_festival
    context[:current_festival] ||= Festival.current
  end

  def current_registration
    context[:current_registration] =
      current_user&.registrations&.includes(:festival)&.find_by(festival: current_festival)
  end
end
