module Types
  class ProfileType < Types::BaseObject
    description 'A profile that may or may not be connected to a user'

    field :id, ID, null: false, description: 'Unique ID'
    field :name, String, null: false, description: 'Name'
  end
end
