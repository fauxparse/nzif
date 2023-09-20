module Registrations
  class RemoveFromSession < ApplicationInteractor
    delegate :session, :registration, :suppress_notifications, to: :context

    def call
      authorize! registration, to: :update?

      session.placements.find_by!(registration_id: registration.id).destroy!

      promote_from_waitlist

      send_notification unless suppress_notifications
    end

    def promote_from_waitlist
      return unless cascade?

      session.placements.reload

      perform(Waitlists::Check, session:)
    end

    def send_notification
      return unless registration.festival.general?

      ParticipantMailer.removed(registration:, session:).deliver_later
    end

    private

    def cascade?
      context[:promote].present?
    end
  end
end
