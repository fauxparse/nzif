module Types
  class MutationType < Types::BaseObject
    description 'Top-level mutation interface'

    field :update_preference, mutation: Mutations::Users::UpdatePreference

    field :update_user, mutation: Mutations::Users::Update

    field :create_slot, mutation: Mutations::Slots::Create
    field :create_slots, mutation: Mutations::Slots::CreateMultiple
  end
end
