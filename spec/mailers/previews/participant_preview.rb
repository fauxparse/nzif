# Preview all emails at http://localhost:3000/rails/mailers/participant
class ParticipantPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/participant/registration_confirmation
  def registration_confirmation
    ParticipantMailer.registration_confirmation
  end

end
