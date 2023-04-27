module Mutations
  module Slots
    class CreateMultiple < BaseMutation
      description 'Create multiple activity slots at once'

      graphql_name 'CreateMultipleSlots'

      argument :attributes, Types::MultipleSlotAttributes, required: true,
        description: 'The attributes for the slots'

      field :slots, [Types::SlotType], null: false, description: 'The newly created slots'

      def resolve(attributes:)
        festival = ::Festival.find(attributes[:festival_id])
        activity_type = attributes[:activity_type]

        slots = attributes[:time_ranges].flat_map do |time_slot|
          attributes[:venue_ids].map do |venue_id|
            perform(::Slots::Create, festival:,
              attributes: { **time_slot, venue_id:, activity_type: }).slot
          end
        end

        { slots: }
      end
    end
  end
end
