class Venue < ApplicationRecord
  include Searchable
  include Geocodable

  acts_as_list

  validates :building, :address, presence: true

  searchable_on :room, :building

  geocoded_by :full_address

  def name
    [room, building].compact_blank.join(' at ')
  end
end
