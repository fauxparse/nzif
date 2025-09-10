class ShortUrl < ApplicationRecord
  include Rails.application.routes.url_helpers

  hashid_config min_hash_length: 3

  ALLOWED_HOSTS = [
    Domains::Main::DOMAIN,
    'bats.co.nz',
  ]

  def redirect?
    host = URI(url).host
    ALLOWED_HOSTS.include?(host)
  end

  def to_s
    short_url(self, host: "https://#{Domains::Short::DOMAIN}")
  end
end
