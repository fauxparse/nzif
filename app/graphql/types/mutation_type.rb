module Types
  class MutationType < Types::BaseObject
    field :update_setting, mutation: Mutations::Users::UpdateSetting
    field :update_user, mutation: Mutations::Users::Update

    field :create_person, mutation: Mutations::People::Create
    field :merge_people, mutation: Mutations::People::Merge
    field :update_person, mutation: Mutations::People::Update

    field :create_activity, mutation: Mutations::Activities::Create
    field :move_activity, mutation: Mutations::Activities::Move
    field :rename_activity, mutation: Mutations::Activities::Rename
    field :update_activity, mutation: Mutations::Activities::Update

    field :create_slot, mutation: Mutations::Slots::Create
    field :create_slots, mutation: Mutations::Slots::CreateMultiple
    field :destroy_slot, mutation: Mutations::Slots::Destroy
    field :update_slot, mutation: Mutations::Slots::Update

    field :create_translation, mutation: Mutations::Translations::Create
    field :destroy_translation, mutation: Mutations::Translations::Destroy
    field :update_translation, mutation: Mutations::Translations::Update
  end
end
