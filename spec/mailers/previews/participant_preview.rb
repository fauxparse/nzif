# Preview all emails at http://localhost:5100/rails/mailers/participant
class ParticipantPreview < ActionMailer::Preview
  # Preview this email at http://localhost:5100/rails/mailers/participant/registration_confirmation
  def registration_confirmation
    ParticipantMailer.registration_confirmation(registration: Registration.find_by(user_id: 1))
  end

  # Preview this email at http://localhost:5100/rails/mailers/participant/workshop_confirmation
  def workshop_confirmation
    ParticipantMailer.workshop_confirmation(registration: Registration.find_by(user_id: 1))
  end
end
