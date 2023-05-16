module Mutations
  module Slots
    class Update < BaseMutation
      graphql_name 'UpdateSlot'

      argument :attributes, Types::SlotAttributes, required: true
      argument :id, ID, required: true

      field :slot, Types::SlotType, null: false

      def resolve(id:, attributes:)
        slot = ::Slot.find(id)

        { slot: perform(::Slots::Update, slot:, attributes:).slot }
      end
    end
  end
end
