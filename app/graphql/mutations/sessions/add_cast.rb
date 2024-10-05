module Mutations
  module Sessions
    class AddCast < BaseMutation
      graphql_name 'AddSessionCast'

      field :cast, Types::PersonType, null: false
      field :session, Types::SessionType, null: false

      argument :profile_id, ID, required: true
      argument :role, Types::RoleType, required: true
      argument :session_id, ID, required: true

      def resolve(session_id:, profile_id:, role:)
        session = ::Session.find(session_id)
        profile = ::Profile.find(profile_id)

        perform(::Sessions::AddCast, session:, profile:, role:)
      end
    end
  end
end
