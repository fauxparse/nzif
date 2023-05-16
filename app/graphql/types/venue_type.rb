module Types
  class VenueType < Types::BaseObject
    field :address, String, null: false
    field :building, String, null: false
    field :id, ID, null: false
    field :latitude, Float, null: false
    field :longitude, Float, null: false
    field :position, Integer, null: false
    field :room, String, null: true
  end
end
