module Calendar
  class Hide < ApplicationInteractor
    include Interactor

    class NotLoggedInError < StandardError; end

    delegate :session, :user, to: :context

    def call
      raise NotLoggedInError if user.blank?

      authorize! session, to: :hide?

      user.hidden_sessions.create_or_find_by!(session:)
    end
  end
end
