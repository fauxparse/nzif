module Types
  class MutationType < Types::BaseObject
    description 'Top-level mutation interface'

    field :update_preference, mutation: Mutations::Users::UpdatePreference
    field :update_user, mutation: Mutations::Users::Update

    field :create_activity, mutation: Mutations::Activities::Create

    field :create_slot, mutation: Mutations::Slots::Create
    field :create_slots, mutation: Mutations::Slots::CreateMultiple
    field :destroy_slot, mutation: Mutations::Slots::Destroy
    field :update_slot, mutation: Mutations::Slots::Update
  end
end
