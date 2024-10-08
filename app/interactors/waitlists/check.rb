module Waitlists
  class Check < ApplicationInteractor
    delegate :session, to: :context

    def call
      skip_authorization!

      return if session.starts_at.past?

      while session.placements.count < session.capacity
        registration = session.waitlist.includes(:registration).first&.registration
        break unless registration

        perform(Waitlists::Promote, session:, registration:, current_user: User.automaton)
      end
    end
  end
end
