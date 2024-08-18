module Donations
  class Confirm < ApplicationInteractor
    delegate :donation, :reference, to: :context
    def call
      skip_authorization!

      donation.update!(reference:, state: :approved)
    end
  end
end
