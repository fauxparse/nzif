class WorkshopFeedbackRemindersJob < ApplicationJob
  queue_as :default

  def perform(*)
    sessions = Session
      .includes(:activity, placements: { registration: { user: :profile } })
      .where('ends_at > ? AND ends_at <= ?', 1.hour.ago, Time.zone.now)

    sessions.each do |session|
      session.placements.each do |placement|
        ParticipantMailer
          .feedback_reminder(session:, registration: placement.registration)
          .deliver_later
      end
    end
  end
end
