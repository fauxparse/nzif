module Types
  class PersonType < Types::BaseObject
    description 'A profile that may or may not be connected to a user'

    field :city, Types::PlaceNameType, null: true, description: 'City'
    field :country, Types::PlaceNameType, null: true, description: 'Country'
    field :id, ID, null: false, description: 'Unique ID'
    field :name, String, null: false, description: 'Name'
    field :picture, Types::ProfilePictureType, null: true, description: 'Profile picture'

    def picture
      object.picture && object
    end

    def city
      Hashie::Mash.new(name: object.city, locale: object.locale) if object.city?
    end

    def country
      Hashie::Mash.new(name: object.country.common_name, locale: object.locale) if object.country?
    end
  end
end
