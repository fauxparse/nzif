module Donations
  class Confirm < ApplicationInteractor
    delegate :donation, :reference, to: :context

    def call
      skip_authorization!

      donation.update!(reference:, state: :approved)
      DonationMailer.notification(donation).deliver_later
    end
  end
end
