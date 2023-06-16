module Mutations
  module Sessions
    class CreateMultiple < BaseMutation
      graphql_name 'CreateMultipleSessions'

      argument :attributes, Types::MultipleSessionAttributes, required: true

      field :sessions, [Types::SessionType], null: false

      def resolve(attributes:)
        festival = ::Festival.find(attributes[:festival_id])
        activity_type = attributes[:activity_type]

        sessions = attributes[:time_ranges].flat_map do |time_session|
          attributes[:venue_ids].map do |venue_id|
            perform(::Sessions::Create, festival:,
              attributes: { **time_session, venue_id:, activity_type: }).session
          end
        end

        { sessions: }
      end
    end
  end
end
