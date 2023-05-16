module Mutations
  module Slots
    class Create < BaseMutation
      graphql_name 'CreateSlot'

      argument :attributes, Types::SlotAttributes, required: true
      argument :festival_id, ID, required: true

      field :slot, Types::SlotType, null: false

      def resolve(festival_id:, attributes:)
        festival = ::Festival.find(festival_id)

        perform(::Slots::Create, festival:, attributes:)
      end
    end
  end
end
