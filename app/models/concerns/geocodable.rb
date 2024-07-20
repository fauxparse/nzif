module Geocodable
  extend ActiveSupport::Concern

  included do
    acts_as_mappable(
      default_units: :kms,
      lat_column_name: :latitude,
      lng_column_name: :longitude,
    )

    before_validation :geocode, if: :requires_geocoding?

    validates :latitude, :longitude, presence: true, numericality: true
  end

  def city
    'Wellington City'
  end

  def country
    'New Zealand'
  end

  def full_address
    [address, city, country].compact.join(', ')
  end

  def requires_geocoding?
    latitude.blank? || longitude.blank? || (address_changed? && persisted?)
  end
end
