module Waitlists
  class Add < ApplicationInteractor
    delegate :session, :registration, to: :context

    def call
      authorize! registration, to: :update?

      context.waitlist = session.waitlist.create_or_find_by!(registration_id: registration.id)
    end
  end
end
