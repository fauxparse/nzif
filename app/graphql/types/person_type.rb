module Types
  class PersonType < Types::BaseObject
    description 'A profile that may or may not be connected to a user'

    field :city, Types::PlaceNameType, null: true, description: 'City'
    field :country, Types::PlaceNameType, null: true, description: 'Country'
    field :id, ID, null: false, description: 'Unique ID'
    field :name, String, null: false, description: 'Name'
    field :picture, Types::ProfilePictureType, null: true, description: 'Profile picture'
    field :possible_user, Types::UserType, null: true, description: 'Candidate user profile'
    field :user, Types::UserType, null: true, description: 'User'

    def picture
      object.picture && object
    end

    def city
      Hashie::Mash.new(name: object.city, locale: object.locale) if object.city?
    end

    def country
      Hashie::Mash.new(name: object.country.common_name, locale: object.locale) if object.country?
    end

    def user
      object.user_id && dataloader.with(Sources::ProfileUser, context:).load(object.user_id)
    end

    def possible_user
      return nil if object.user_id

      User.search(object.name).first
    end
  end
end
