module Mutations
  module Registrations
    class MoveAllocatedParticipant < BaseMutation
      argument :new_session_id, ID, required: false, default_value: nil
      argument :old_session_id, ID, required: false, default_value: nil
      argument :registration_id, ID, required: true
      argument :waitlist, Boolean, required: false, default_value: false

      field :affected_sessions, [Types::WorkshopAllocationSessionType], null: false

      def resolve(registration_id:, old_session_id:, new_session_id:, waitlist: false)
        perform(
          ::Registrations::MoveAllocatedWorkshopParticipant,
          allocation: Allocation.find_by!(festival_id: current_festival.id),
          registration_id:,
          old_session_id:,
          new_session_id:,
          waitlist:,
        )
      end
    end
  end
end
