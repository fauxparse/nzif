module Types
  class PersonType < Types::BaseObject
    field :bio, String, null: false
    field :city, Types::PlacenameType, null: true
    field :country, Types::PlacenameType, null: true
    field :id, ID, null: false
    field :name, String, null: false
    field :phone, String, null: true
    field :picture, Types::ProfilePictureType, null: true
    field :pronouns, String, null: true
    field :user, Types::UserType, null: true

    def id
      super || ''
    end

    def name
      object.name || ''
    end

    def picture
      object.picture && object
    end

    delegate :city, to: :object

    def country
      return unless object.country?

      Placename.new(
        id: object.country.alpha2,
        english: object.country.common_name,
        traditional: object.country.alpha2 == 'NZ' ? 'Aotearoa' : nil,
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
