module Sessions
  class AddCast < ApplicationInteractor
    AlreadyCast = Class.new(StandardError)

    delegate :session, :profile, :role, to: :context

    def call
      authorize! session, to: :cast?

      raise AlreadyCast if session.cast.exists?(profile:, role:)

      context.cast = session.cast.create!(profile:, role:).profile
    end
  end
end
