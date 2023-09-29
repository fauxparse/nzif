module Mutations
  module Messages
    class Send < BaseMutation
      graphql_name 'SendMessage'

      argument :content, String, required: true
      argument :session_id, ID, required: true
      argument :subject, String, required: true

      field :message, Types::MessageType, null: false

      def resolve(session_id:, subject:, content:)
        perform(
          ::Messages::CreateAndSend,
          subject:,
          content:,
          messageable: ::Session.find(session_id),
        )
      end
    end
  end
end
