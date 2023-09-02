module Mutations
  module Registrations
    class AddToWaitlist < BaseMutation
      field :waitlist, Types::WaitlistType, null: false

      argument :registration_id, ID, required: false
      argument :session_id, ID, required: true

      def resolve(registration_id:, session_id:)
        registration = find_registration(id: registration_id)
        session = current_festival.sessions.find(session_id)
        perform(::WaitlistPlaces::Add, registration:, session:)
      end
    end
  end
end
