module Types
  class VenueType < Types::BaseObject
    description 'A venue'

    field :address, String, null: false, description: 'Address'
    field :building, String, null: false, description: 'Building'
    field :id, ID, null: false, description: 'Unique ID'
    field :latitude, Float, null: false, description: 'Latitude'
    field :longitude, Float, null: false, description: 'Longitude'
    field :position, Integer, null: false, description: 'Sort position'
    field :room, String, null: true, description: 'Room'
  end
end
