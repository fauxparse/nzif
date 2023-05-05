module Types
  class PersonType < Types::BaseObject
    description 'A profile that may or may not be connected to a user'

    field :id, ID, null: false, description: 'Unique ID'
    field :name, String, null: false, description: 'Name'
    field :profile_picture, Types::ProfilePictureType, null: true, description: 'Profile picture'

    def profile_picture
      object
    end
  end
end
