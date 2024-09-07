module Mutations
  module Registrations
    class AddToWaitlist < BaseMutation
      field :waitlist, Types::WaitlistType, null: false

      argument :position, Integer, required: false
      argument :registration_id, ID, required: false
      argument :session_id, ID, required: true

      def resolve(session_id:, registration_id: nil, position: nil)
        registration = find_registration(id: registration_id)
        session = current_festival.sessions.includes(:waitlist).find(session_id)
        position ||= session.waitlist.count + 1
        perform(::Waitlists::Add, registration:, session:, position:)
      end
    end
  end
end
