module Mutations
  module Waitlists
    class Move < BaseMutation
      graphql_name 'MoveWaitlistParticipant'

      field :waitlist, [Types::WaitlistType], null: false

      argument :position, Integer, required: true
      argument :registration_id, ID, required: true
      argument :session_id, ID, required: true

      def resolve(session_id:, registration_id:, position:)
        session = ::Session.find(session_id)
        registration = ::Registration.find(registration_id)

        perform(
          ::Waitlists::Move,
          session:,
          registration:,
          position:,
        ).session
      end
    end
  end
end
