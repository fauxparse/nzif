module Mutations
  module Sessions
    class Create < BaseMutation
      graphql_name 'CreateSession'

      argument :attributes, Types::SessionAttributes, required: true
      argument :festival_id, ID, required: true

      field :session, Types::SessionType, null: false

      def resolve(festival_id:, attributes:)
        festival = ::Festival.find(festival_id)

        perform(::Sessions::Create, festival:, attributes:)
      end
    end
  end
end
