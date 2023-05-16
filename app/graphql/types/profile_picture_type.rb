module Types
  class ProfilePictureType < Types::BaseObject
    field :id, GraphQL::Types::ID, null: false
    field :large, String, null: false, description: '256x256'
    field :medium, String, null: false, description: '128x128'
    field :small, String, null: false, description: '64x64'

    def small
      object.picture(:small).url
    end

    def medium
      object.picture(:medium).url
    end

    def large
      object.picture(:large).url
    end
  end
end
