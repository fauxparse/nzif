module Mutations
  module Preferences
    class Remove < BaseMutation
      graphql_name 'RemovePreference'

      payload_type Boolean

      argument :registration_id, ID, required: false
      argument :session_id, ID, required: true

      def resolve(registration_id:, session_id:)
        registration = find_registration(id: registration_id)
        session = registration.festival.sessions.find(session_id)
        perform(::Preferences::Destroy, registration:, session:).success?
      end
    end
  end
end
