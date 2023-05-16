module Mutations
  module Slots
    class CreateMultiple < BaseMutation
      graphql_name 'CreateMultipleSlots'

      argument :attributes, Types::MultipleSlotAttributes, required: true

      field :slots, [Types::SlotType], null: false

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
