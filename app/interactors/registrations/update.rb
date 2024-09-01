module Registrations
  class Update < ApplicationInteractor
    delegate :registration, to: :context

    def call
      authorize! registration, to: :update?

      registration.update!(attributes)
    end

    def attributes
      @attributes ||= ActionController::Parameters.new(context.attributes.to_h)
        .permit(
          :code_of_conduct_accepted,
          :code_of_conduct_accepted_at,
          :donate_discount,
          :photo_permission,
        )
    end
  end
end
