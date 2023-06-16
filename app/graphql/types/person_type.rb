module Types
  class PersonType < Types::BaseObject
    field :bio, String, null: false
    field :city, Types::PlaceNameType, null: true
    field :country, Types::PlaceNameType, null: true
    field :id, ID, null: false
    field :name, String, null: false
    field :phone, String, null: true
    field :picture, Types::ProfilePictureType, null: true
    field :pronouns, String, null: true
    field :user, Types::UserType, null: true

    def id
      super || 'new'
    end

    def picture
      object.picture && object
    end

    def city
      Hashie::Mash.new(id: object.city, name: object.city, locale: object.locale) if object.city?
    end

    def country
      return unless object.country?

      Hashie::Mash.new(
        id: object.country.alpha2,
        name: object.country.common_name,
        locale: object.locale,
      )
    end

    def bio
      object.bio.presence || ''
    end

    def user
      object.user_id && dataloader.with(Sources::ProfileUser, context:).load(object.id)
    end
  end
end
