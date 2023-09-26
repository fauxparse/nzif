module Sessions
  class RemoveCast < ApplicationInteractor
    NotCast = Class.new(StandardError)

    delegate :session, :profile, :role, to: :context

    def call
      authorize! session, to: :cast?

      raise NotCast if cast.blank?

      cast.destroy!
    end

    private

    def cast
      @cast ||= session.cast.find_by(profile:, role:)
    end
  end
end
