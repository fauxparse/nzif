module Types
  class PersonType < Types::BaseObject
    field :bio, String, null: false
    field :city, Types::CityType, null: true
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

    def city
      object.city && dataloader.with(Sources::Cities, context:).load(object.city)
    end

    def bio
      object.bio.presence || ''
    end

    def user
      object.user_id && dataloader.with(Sources::ProfileUser, context:).load(object.id)
    end
  end
end
