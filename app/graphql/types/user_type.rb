module Types
  class UserType < Types::BaseObject
    description 'A user'

    field :email, String, null: false, description: 'Email address'
    field :id, ID, null: false, description: 'Unique ID'
    field :name, String, null: false, description: 'Name'
  end
end
