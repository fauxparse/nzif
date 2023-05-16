# rubocop:disable GraphQL/ExtractInputType

module Mutations
  module Activities
    class Create < BaseMutation
      graphql_name 'CreateActivity'

      field :activity, Types::ActivityType, null: false
      field :slot, Types::SlotType, null: true

      argument :attributes, Types::ActivityAttributes, required: true
      argument :festival_id, GraphQL::Types::ID, required: true
      argument :slot_id, GraphQL::Types::ID, required: false
      argument :type, Types::ActivityTypeType, required: true

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
