class ShortUrl < ApplicationRecord
  hashid_config min_hash_length: 3

  def redirect?
    URI(url).host == Domains::Main::DOMAIN
  end
end
