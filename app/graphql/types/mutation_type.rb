module Types
  class MutationType < Types::BaseObject
    field :reset_password_and_log_in, mutation: Mutations::Users::ResetPasswordAndLogIn
    field :update_setting, mutation: Mutations::Users::UpdateSetting
    field :update_user, mutation: Mutations::Users::Update

    field :create_person, mutation: Mutations::People::Create
    field :merge_people, mutation: Mutations::People::Merge
    field :update_person, mutation: Mutations::People::Update

    field :create_activity, mutation: Mutations::Activities::Create
    field :move_activity, mutation: Mutations::Activities::Move
    field :rename_activity, mutation: Mutations::Activities::Rename
    field :update_activity, mutation: Mutations::Activities::Update

    field :create_session, mutation: Mutations::Sessions::Create
    field :create_sessions, mutation: Mutations::Sessions::CreateMultiple
    field :destroy_session, mutation: Mutations::Sessions::Destroy
    field :update_session, mutation: Mutations::Sessions::Update

    field :create_translation, mutation: Mutations::Translations::Create
    field :destroy_translation, mutation: Mutations::Translations::Destroy
    field :update_translation, mutation: Mutations::Translations::Update

    field :add_preference, mutation: Mutations::Preferences::Add
    field :remove_preference, mutation: Mutations::Preferences::Remove

    field :allocate_workshops, mutation: Mutations::Registrations::Allocate
    field :finalise_registration, mutation: Mutations::Registrations::Finalise
    field :update_registration_user_details, mutation: Mutations::Registrations::UpdateUserDetails
  end
end
