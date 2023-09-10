module Registrations
  class AddToSession < ApplicationInteractor
    delegate :session, :registration, to: :context

    def call
      authorize! registration, to: :update?

      session.placements.create_or_find_by!(registration_id: registration.id)
      removed = perform(RemoveFromOtherSessions, session:, registration:).sessions.map(&:id)

      send_notification(removed)
    end

    private

    def send_notification(removed)
      return unless registration.festival.general?

      ParticipantMailer.added(registration:, session:, removed:).deliver_later
    end
  end
end
