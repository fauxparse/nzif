class DonationMailer < ApplicationMailer
  def notification(donation)
    @donation = donation

    mail(
      to: 'directors@improvfest.nz',
      subject: donation.anonymous ? 'Anonymous donation' : "Donation from #{donation.name}",
    )
  end
end
