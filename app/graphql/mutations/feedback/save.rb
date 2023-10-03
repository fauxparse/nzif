module Mutations
  module Feedback
    class Save < BaseMutation
      graphql_name 'SaveFeedback'

      field :feedback, Types::FeedbackType, null: false

      argument :attributes, Types::FeedbackAttributes, required: true
      argument :session_id, ID, required: true

      def resolve(session_id:, attributes:)
        registration = current_festival.registrations.find_by(user: current_user)
        session = current_festival.sessions.find(session_id)
        perform(
          ::Feedback::Save,
          attributes: attributes.to_h,
          registration:,
          session:,
        )
      end
    end
  end
end
