class ParticipantMailer < ApplicationMailer
  def registration_confirmation(registration)
    @user = registration.user
    @festival = registration.festival

    mail(
      to: email_address_with_name(@user.email, @user.profile.name),
      subject: "Your NZIF #{registration.festival.year} registration",
    )
  end
end
