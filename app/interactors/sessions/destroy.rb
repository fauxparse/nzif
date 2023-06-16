module Sessions
  class Destroy < ApplicationInteractor
    def call
      authorize! session, to: :destroy?

      session.destroy!
    end

    delegate :session, to: :context
  end
end
