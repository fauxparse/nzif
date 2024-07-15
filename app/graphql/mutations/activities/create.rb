module Mutations
  module Activities
    class Create < BaseMutation
      graphql_name 'CreateActivity'

      field :activity, Types::ActivityType, null: false
      field :session, Types::SessionType, null: true

      argument :attributes, Types::ActivityAttributes, required: true
      argument :festival_id, GraphQL::Types::ID, required: false
      argument :session_id, GraphQL::Types::ID, required: false
      argument :type, Types::ActivityTypeType, required: true

      def resolve(type:, attributes:, session_id: nil, festival_id: nil)
        festival = festival_id ? ::Festival.find(festival_id) : current_festival
        session = festival.sessions.find(session_id) if session_id.present?

        perform(
          ::Activities::Create, festival:, activity_type: type, attributes:, session:
        )
      end
    end
  end
end

# rubocop:enable GraphQL/ExtractInputType
