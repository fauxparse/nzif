module Types
  class MutationType < Types::BaseObject
    description 'Top-level mutation interface'

    field :update_preference, mutation: Mutations::Users::UpdatePreference
    field :update_user, mutation: Mutations::Users::Update
  end
end
