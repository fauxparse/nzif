module Mutations
  module Sessions
    class Update < BaseMutation
      graphql_name 'UpdateSession'

      argument :attributes, Types::SessionAttributes, required: true
      argument :id, ID, required: true

      field :session, Types::SessionType, null: false

      def resolve(id:, attributes:)
        session = ::Session.find(id)

        { session: perform(::Sessions::Update, session:, attributes:).session }
      end
    end
  end
end
