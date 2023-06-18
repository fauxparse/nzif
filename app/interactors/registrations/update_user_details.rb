module Registrations
  class UpdateUserDetails < ApplicationInteractor
    delegate :registration, :attributes, to: :context

    def call
      authorize! registration, to: :update?

      registration.transaction do
        registration.profile.update!(profile_attributes)
        registration.user.update!(user_attributes)
        registration.update!(registration_attributes)
      end
    end

    def sanitized_attributes
      @sanitized_attributes ||=
        ActionController::Parameters.new(attributes.to_h)
          .permit(:name, :email, :pronouns, :city, :country, :phone, :code_of_conduct_accepted_at)
    end

    def profile_attributes
      sanitized_attributes.except(:email, :code_of_conduct_accepted_at)
    end

    def registration_attributes
      sanitized_attributes.slice(:code_of_conduct_accepted_at)
    end

    def user_attributes
      sanitized_attributes.slice(:name, :email)
    end
  end
end
