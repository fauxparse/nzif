module Mutations
  module Sessions
    class CreateMultiple < BaseMutation
      graphql_name 'CreateMultipleSessions'

      argument :attributes, Types::MultipleSessionAttributes, required: true

      field :sessions, [Types::SessionType], null: false

      def resolve(attributes:)
        festival = ::Festival.find(attributes[:festival_id])

        sessions = attributes[:time_ranges].flat_map do |time_session|
          attributes[:venue_ids].map do |venue_id|
            perform(::Sessions::Create, festival:,
              attributes: {
                **time_session,
                venue_id:,
                **attributes.to_h.slice(:activity_type, :activity_id, :capacity),
              }).session
          end
        end

        { sessions: }
      end
    end
  end
end
