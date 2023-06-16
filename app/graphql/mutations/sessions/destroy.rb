module Mutations
  module Sessions
    class Destroy < BaseMutation
      graphql_name 'DestroySession'

      payload_type Boolean

      argument :id, ID, required: true

      def resolve(id:)
        perform(::Sessions::Destroy, session: Session.find(id))
      end
    end
  end
end
