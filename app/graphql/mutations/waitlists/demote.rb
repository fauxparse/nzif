module Mutations
  module Waitlists
    class Demote < BaseMutation
      graphql_name 'DemoteSessionParticipant'

      field :session, Types::SessionType, null: false

      argument :position, Integer, required: true
      argument :registration_id, ID, required: true
      argument :session_id, ID, required: true

      def resolve(session_id:, registration_id:, position:)
        session = ::Session.find(session_id)
        registration = ::Registration.find(registration_id)

        perform(
          ::Waitlists::Demote,
          session:,
          registration:,
          position:,
        )
      end
    end
  end
end
