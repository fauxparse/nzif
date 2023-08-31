class ShortUrl < ApplicationRecord
  include Rails.application.routes.url_helpers

  hashid_config min_hash_length: 3

  def redirect?
    URI(url).host == Domains::Main::DOMAIN
  end

  def to_s
    short_url(self, host: "https://#{Domains::Short::DOMAIN}")
  end
end
