module Donations
  class Create < ApplicationInteractor
    delegate :attributes, to: :context

    def call
      skip_authorization!

      donation.save!

      Newsletter::Subscribe.call(name: donation.name, email: donation.email) if donation.newsletter?
    end

    def donation
      context[:donation] ||= Donation.new(attributes)
    end
  end
end
