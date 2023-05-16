module Types
  class PersonType < Types::BaseObject
    field :city, Types::PlaceNameType, null: true
    field :country, Types::PlaceNameType, null: true
    field :id, ID, null: false
    field :name, String, null: false
    field :picture, Types::ProfilePictureType, null: true
    field :pronouns, String, null: true
    field :user, Types::UserType, null: true

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
  end
end
