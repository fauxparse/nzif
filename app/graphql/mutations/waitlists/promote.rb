module Mutations
  module Waitlists
    class Promote < BaseMutation
      graphql_name 'PromoteWaitlistParticipant'

      field :registration, Types::RegistrationType, null: false

      argument :registration_id, ID, required: true
      argument :session_id, ID, required: true

      def resolve(session_id:, registration_id:)
        session = ::Session.find(session_id)
        registration = ::Registration.find(registration_id)

        perform(
          ::Waitlists::Promote,
          session:,
          registration:,
        )
      end
    end
  end
end
