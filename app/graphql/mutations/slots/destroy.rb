module Mutations
  module Slots
    class Destroy < BaseMutation
      graphql_name 'DestroySlot'

      payload_type Boolean

      argument :id, ID, required: true

      def resolve(id:)
        perform(::Slots::Destroy, slot: Slot.find(id))
      end
    end
  end
end
