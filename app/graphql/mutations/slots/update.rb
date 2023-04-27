module Mutations
  module Slots
    class Update < BaseMutation
      description 'Update an activity slot'

      graphql_name 'UpdateSlot'

      argument :attributes, Types::SlotAttributes, required: true,
        description: 'The attributes for the slot'
      argument :id, ID, required: true,
        description: 'The ID of the slot to update'

      field :slot, Types::SlotType, null: false, description: 'The updated slot'

      def resolve(id:, attributes:)
        slot = ::Slot.find(id)

        { slot: perform(::Slots::Update, slot:, attributes:).slot }
      end
    end
  end
end
