module Mutations
  module Preferences
    class Remove < BaseMutation
      payload_type Boolean

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
        ::Preferences::Destroy.call(registration:, session:).success?
      end
    end
  end
end
