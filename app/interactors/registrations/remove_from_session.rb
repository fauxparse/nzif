module Registrations
  class RemoveFromSession < ApplicationInteractor
    delegate :session, :registration, to: :context

    def call
      authorize! registration, to: :update?

      session.placements.find_by!(registration_id: registration.id).destroy!

      promote_from_waitlist

      send_notification
    end

    def promote_from_waitlist
      return if context[:promote].blank?

      session.placements.reload
      while session.placements.count < session.capacity
        registration = session.waitlist.includes(:registration).first&.registration
        break unless registration

        perform(Waitlists::Promote, session:, registration:)
      end
    end

    def send_notification
      return unless registration.festival.general?

      ParticipantMailer.removed(registration:, session:).deliver_later
    end
  end
end
