module Mutations
  module Slots
    class Destroy < BaseMutation
      description 'Removes a slot from the timetable'

      graphql_name 'DestroySlot'

      payload_type Boolean

      argument :id, ID, required: true, description: 'Slot ID'

      def resolve(id:)
        perform(::Slots::Destroy, slot: Slot.find(id))
      end
    end
  end
end
