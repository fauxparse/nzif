module Mutations
  module Preferences
    class Add < BaseMutation
      field :preference, Types::PreferenceType, null: false

      argument :registration_id, ID, required: false
      argument :session_id, ID, required: true

      def resolve(registration_id:, session_id:)
        registration =
          if registration_id
            ::Registration.includes(:festival).find(registration_id)
          else
            current_registration
          end
        session = registration.festival.sessions.find(session_id)
        ::Preferences::Create.call(registration:, session:)
      end
    end
  end
end
