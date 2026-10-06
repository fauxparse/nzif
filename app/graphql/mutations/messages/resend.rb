module Mutations
  module Messages
    class Resend < BaseMutation
      graphql_name 'ResendMessage'

      argument :id, ID, required: true

      field :message, Types::MessageType, null: false

      def resolve(id:)
        perform(
          ::Messages::Resend,
          message: ::Message.find(id),
        )
      end
    end
  end
end
