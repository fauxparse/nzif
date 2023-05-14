module Types
  class MutationType < Types::BaseObject
    description 'Top-level mutation interface'

    field :update_preference, mutation: Mutations::Users::UpdatePreference
    field :update_user, mutation: Mutations::Users::Update

    field :create_profile, mutation: Mutations::Profiles::Create

    field :create_activity, mutation: Mutations::Activities::Create
    field :move_activity, mutation: Mutations::Activities::Move
    field :rename_activity, mutation: Mutations::Activities::Rename
    field :update_activity, mutation: Mutations::Activities::Update

    field :create_slot, mutation: Mutations::Slots::Create
    field :create_slots, mutation: Mutations::Slots::CreateMultiple
    field :destroy_slot, mutation: Mutations::Slots::Destroy
    field :update_slot, mutation: Mutations::Slots::Update
  end
end
