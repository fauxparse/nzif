class SessionMailer < ApplicationMailer
  def custom(message:, recipients:)
    @message = message

    mail(
      to: 'registrations@improvfest.nz',
      bcc: recipients.map { |r| email_address_with_name(r.email, r.name) },
      subject: "NZIF: #{message.subject}",
      reply_to: email_address_with_name(message.sender.email, message.sender.name),
    )
  end
end
