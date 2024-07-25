module Registrations
  class UpdateUserDetails < ApplicationInteractor
    delegate :registration, :attributes, to: :context

    USER_ATTRIBUTES = %i[
      name
      email
    ].freeze

    PROFILE_ATTRIBUTES = %i[
      name
      pronouns
      city
      country
      phone
    ].freeze

    REGISTRATION_ATTRIBUTES = %i[
      code_of_conduct_accepted_at
      photo_permission
      show_explainer
    ].freeze

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
          .permit(USER_ATTRIBUTES + PROFILE_ATTRIBUTES + REGISTRATION_ATTRIBUTES)
    end

    def profile_attributes
      sanitized_attributes.slice(*PROFILE_ATTRIBUTES)
    end

    def registration_attributes
      sanitized_attributes.slice(*REGISTRATION_ATTRIBUTES)
    end

    def user_attributes
      sanitized_attributes.slice(*USER_ATTRIBUTES)
    end
  end
end
