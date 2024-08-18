# Preview all emails at http://localhost:3000/rails/mailers/donation_mailer
class DonationMailerPreview < ActionMailer::Preview
  # Preview this email at http://localhost:5100/rails/mailers/donation_mailer/notification
  def notification
    donation = FactoryBot.build(:donation, :with_message)

    DonationMailer.notification(donation)
  end

  def anonymous
    donation = FactoryBot.build(:donation, :anonymous)

    DonationMailer.notification(donation)
  end
end
