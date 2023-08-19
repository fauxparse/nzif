# Preview all emails at http://localhost:5100/rails/mailers/participant
class ParticipantPreview < ActionMailer::Preview
  # Preview this email at http://localhost:5100/rails/mailers/participant/registration_confirmation
  def registration_confirmation
    ParticipantMailer.registration_confirmation
  end

  # Preview this email at http://localhost:5100/rails/mailers/participant/workshop_confirmation
  def workshop_confirmation
    ParticipantMailer.workshop_confirmation(Registration.find_by(user_id: 1))
  end
end
