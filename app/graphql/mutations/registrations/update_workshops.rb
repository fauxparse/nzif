module Mutations
  module Registrations
    class UpdateWorkshops < BaseMutation
      field :registration, Types::RegistrationType, null: false

      argument :session_ids, [ID], required: true
      argument :waitlist_ids, [ID], required: true

      def resolve(session_ids:, waitlist_ids:)
        perform(
          ::Registrations::UpdateWorkshopChoices,
          registration: current_registration,
          session_ids:,
          waitlist_ids:,
        )
      end
    end
  end
end
