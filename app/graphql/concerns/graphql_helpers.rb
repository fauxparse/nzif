module GraphqlHelpers
  extend ActiveSupport::Concern

  def current_festival
    context[:current_festival] ||= Festival.current
  end

  def current_registration
    registrations = current_user&.registrations
    context[:current_registration] =
      registrations&.includes(:festival)&.find_by(festival: current_festival)
  end
end
