module WaitlistPlaces
  class Offer
    include Rails.application.routes.url_helpers
    include Interactor

    delegate :waitlist, to: :context

    def call
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
