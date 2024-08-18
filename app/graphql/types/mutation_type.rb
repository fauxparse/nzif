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

    field :add_session_cast, mutation: Mutations::Sessions::AddCast
    field :create_session, mutation: Mutations::Sessions::Create
    field :create_sessions, mutation: Mutations::Sessions::CreateMultiple
    field :destroy_session, mutation: Mutations::Sessions::Destroy
    field :remove_session_cast, mutation: Mutations::Sessions::RemoveCast
    field :update_session, mutation: Mutations::Sessions::Update

    field :create_translation, mutation: Mutations::Translations::Create
    field :destroy_translation, mutation: Mutations::Translations::Destroy
    field :update_translation, mutation: Mutations::Translations::Update

    field :add_preference, mutation: Mutations::Preferences::Add
    field :add_to_session, mutation: Mutations::Registrations::AddToSession
    field :add_to_waitlist, mutation: Mutations::Registrations::AddToWaitlist
    field :demote_session_participant, mutation: Mutations::Waitlists::Demote
    field :move_waitlist_participant, mutation: Mutations::Waitlists::Move
    field :promote_waitlist_participant, mutation: Mutations::Waitlists::Promote
    field :remove_from_session, mutation: Mutations::Registrations::RemoveFromSession
    field :remove_from_waitlist, mutation: Mutations::Registrations::RemoveFromWaitlist
    field :remove_preference, mutation: Mutations::Preferences::Remove
    field :update_preferences, mutation: Mutations::Preferences::Update

    field :allocate_workshops, mutation: Mutations::Registrations::Allocate
    field :finalise_registration, mutation: Mutations::Registrations::Finalise
    field :move_allocated_participant, mutation: Mutations::Registrations::MoveAllocatedParticipant
    field :update_registration_user_details, mutation: Mutations::Registrations::UpdateUserDetails

    field :add_payment, mutation: Mutations::Payments::Add
    field :add_voucher, mutation: Mutations::Payments::AddVoucher
    field :approve_payment, mutation: Mutations::Payments::Approve
    field :cancel_payment, mutation: Mutations::Payments::Cancel
    field :promise_internet_banking_payment,
      mutation: Mutations::Payments::PromiseInternetBankingPayment
    field :update_payment, mutation: Mutations::Payments::Update

    field :send_message, mutation: Mutations::Messages::Send

    field :save_feedback, mutation: Mutations::Feedback::Save

    field :set_session_visibility, mutation: Mutations::Calendar::SetSessionVisibility

    field :update_profile, mutation: Mutations::Profile::Update

    field :create_donation, mutation: Mutations::Donations::Create
  end
end
