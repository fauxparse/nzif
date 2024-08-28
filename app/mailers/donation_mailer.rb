class DonationMailer < ApplicationMailer
  def notification(donation)
    @donation = donation

    mail(
      to: 'directors@improvfest.nz',
      subject: donation.anonymous ? 'Anonymous donation' : "Donation from #{donation.name}",
    )
  end

  def receipt(donation)
    @donation = donation

    mail(
      to: donation.email,
      bcc: 'directors@improvfest.nz',
      subject: 'Thank you for your donation to the NZ Improv Festival',
    )
  end
end
