module Mutations
  module Registrations
    class RemoveFromWaitlist < BaseMutation
      payload_type Boolean

      argument :registration_id, ID, required: false
      argument :session_id, ID, required: true

      def resolve(session_id:, registration_id: nil)
        registration = find_registration(id: registration_id)
        session = current_festival.sessions.find(session_id)
        perform(::WaitlistPlaces::Remove, registration:, session:)
        true
      end
    end
  end
end
