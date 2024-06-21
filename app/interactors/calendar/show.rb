module Calendar
  class Show < ApplicationInteractor
    include Interactor

    class NotLoggedInError < StandardError; end

    delegate :session, :user, to: :context

    def call
      raise NotLoggedInError if user.blank?

      authorize! session, to: :show?

      user.hidden_sessions.where(session:).destroy_all
    end
  end
end
