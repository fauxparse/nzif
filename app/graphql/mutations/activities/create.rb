module Mutations
  module Activities
    class Create < BaseMutation
      graphql_name 'CreateActivity'

      field :activity, Types::ActivityType, null: false
      field :session, Types::SessionType, null: true

      argument :attributes, Types::ActivityAttributes, required: true
      argument :festival_id, GraphQL::Types::ID, required: true
      argument :session_id, GraphQL::Types::ID, required: false
      argument :type, Types::ActivityTypeType, required: true

      def resolve(festival_id:, type:, attributes:, session_id: nil)
        festival = ::Festival.find(festival_id)
        session = festival.sessions.find(session_id) if session_id.present?

        perform(
          ::Activities::Create, festival:, activity_type: type, attributes:, session:
        )
      end
    end
  end
end

# rubocop:enable GraphQL/ExtractInputType
