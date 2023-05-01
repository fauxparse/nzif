# rubocop:disable GraphQL/ExtractInputType

module Mutations
  module Activities
    class Create < BaseMutation
      description 'Create a new activity'

      graphql_name 'CreateActivity'

      field :activity, Types::ActivityType, null: false,
        description: 'The newly created activity'
      field :slot, Types::SlotType, null: true,
        description: 'The programmed slot, if any'

      argument :attributes, Types::ActivityAttributes, required: true,
        description: 'Attributes for the new activity'
      argument :festival_id, GraphQL::Types::ID, required: true,
        description: 'ID of the festival to which the activity belongs'
      argument :slot_id, GraphQL::Types::ID, required: false,
        description: 'Immediately program this activity into the given slot'
      argument :type, Types::ActivityTypeType, required: true,
        description: 'Type of activity to create'

      def resolve(festival_id:, type:, attributes:, slot_id:)
        festival = ::Festival.find(festival_id)
        slot = festival.slots.find(slot_id) if slot_id.present?

        perform(
          ::Activities::Create, festival:, activity_type: type, attributes:, slot:
        )
      end
    end
  end
end

# rubocop:enable GraphQL/ExtractInputType
