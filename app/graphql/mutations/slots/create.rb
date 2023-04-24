module Mutations
  module Slots
    class Create < BaseMutation
      description 'Create an activity slot'

      argument :attributes, Types::SlotAttributes, required: true,
        description: 'The attributes for the slot'
      argument :festival_id, ID, required: true,
        description: 'The ID of the festival to which the slot belongs'

      field :slot, Types::SlotType, null: false, description: 'The newly created slot'

      def resolve(festival_id:, attributes:)
        festival = ::Festival.find(festival_id)

        { slot: perform(::Slots::Create, festival:, attributes:).slot }
      end
    end
  end
end
