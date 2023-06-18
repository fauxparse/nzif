module Mutations
  module Preferences
    class Add < BaseMutation
      graphql_name 'AddPreference'

      field :preference, Types::PreferenceType, null: false

      argument :registration_id, ID, required: false
      argument :session_id, ID, required: true

      def resolve(registration_id:, session_id:)
        registration = find_registration(id: registration_id)
        session = registration.festival.sessions.find(session_id)
        perform(::Preferences::Create, registration:, session:)
      end
    end
  end
end
