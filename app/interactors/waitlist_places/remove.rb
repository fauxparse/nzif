module WaitlistPlaces
  class Remove < ApplicationInteractor
    delegate :session, :registration, to: :context

    def call
      authorize! registration, to: :update?

      session.waitlist.find_by!(registration_id: registration.id).destroy!
    end
  end
end
