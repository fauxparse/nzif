module Mutations
  module Registrations
    class RemoveFromSession < BaseMutation
      field :registration, Types::RegistrationType, null: false
      field :session, Types::SessionType, null: false

      argument :registration_id, ID, required: false
      argument :session_id, ID, required: true

      def resolve(session_id:, registration_id: nil)
        registration = find_registration(id: registration_id)
        session = current_festival.sessions.find(session_id)
        perform(::Registrations::RemoveFromSession, registration:, session:)
      end
    end
  end
end
