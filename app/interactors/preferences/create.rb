module Preferences
  class Create < ApplicationInteractor
    delegate :registration, :session, to: :context

    def call
      authorize! registration, to: :update?

      preference.save!
    end

    def preference
      context.preference ||= registration.preferences.build(session:)
    end
  end
end
