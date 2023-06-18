module Preferences
  class Create < ApplicationInteractor
    delegate :registration, :session, to: :context

    def call
      Rails.logger.info registration.inspect
      Rails.logger.info current_user.inspect
      authorize! registration, to: :update?

      preference.save!
    end

    def preference
      context.preference ||= registration.preferences.build(session:)
    end
  end
end
