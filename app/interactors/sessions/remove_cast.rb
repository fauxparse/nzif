module Sessions
  class RemoveCast < ApplicationInteractor
    class NotCast < StandardError
    end

    delegate :session, :profile, :role, to: :context

    def call
      authorize! session, to: :cast?

      raise NotCast if cast.blank?

      cast.destroy!
    end

    private

    def cast
      return @cast if defined?(@cast)

      @cast = session.cast.find_by(profile:, role:)
    end
  end
end
