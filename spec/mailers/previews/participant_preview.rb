# Preview all emails at http://localhost:5100/rails/mailers/participant
class ParticipantPreview < ActionMailer::Preview
  # Preview this email at http://localhost:5100/rails/mailers/participant/registration_confirmation
  def registration_confirmation
    ParticipantMailer.registration_confirmation(registration: Registration.find_by(user_id: 1,
      festival_id: 2))
  end

  # Preview this email at http://localhost:5100/rails/mailers/participant/workshop_confirmation
  def workshop_confirmation
    ParticipantMailer.workshop_confirmation(registration: Registration.find_by(user_id: 18,
      festival_id: 2))
  end

  def feedback_reminder
    placement = Placement.includes(registration: { user: :profile }, session: :activity).first
    ParticipantMailer.feedback_reminder(
      registration: placement.registration,
      session: placement.session,
    )
  end
end
