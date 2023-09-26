module Mutations
  module Sessions
    class RemoveCast < BaseMutation
      graphql_name 'RemoveSessionCast'

      payload_type Boolean

      argument :profile_id, ID, required: true
      argument :role, Types::RoleType, required: true
      argument :session_id, ID, required: true

      def resolve(session_id:, profile_id:, role:)
        session = ::Session.find(session_id)
        profile = ::Profile.find(profile_id)

        perform(::Sessions::RemoveCast, session:, profile:, role:)
      end
    end
  end
end
