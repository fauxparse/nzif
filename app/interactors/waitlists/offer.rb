module Waitlists
  class Offer < ApplicationInteractor
    include Rails.application.routes.url_helpers

    delegate :waitlist, to: :context

    def call
      authorize! waitlist.session, to: :update?
      short_url
      waitlist.update!(offered_at: Time.zone.now)
    end

    def short_url
      context[:short_url] ||= ShortUrl.create!(
        url: accept_waitlist_url(waitlist, host: Domains::Main::DOMAIN),
      ).to_s
    end

    private

    def send_notifications
      # TODO
    end
  end
end
