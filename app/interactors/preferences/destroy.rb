module Preferences
  class Destroy < ApplicationInteractor
    delegate :registration, :session, to: :context

    def call
      authorize! registration, to: :update?

      preference.destroy
    end

    def preference
      context.preference ||= registration.preferences.find_by!(session_id: session.id)
    end
  end
end
