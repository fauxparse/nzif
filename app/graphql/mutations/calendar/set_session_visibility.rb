module Mutations
  module Calendar
    class SetSessionVisibility < BaseMutation
      argument :hidden, Boolean, required: true
      argument :session_id, ID, required: true

      payload_type Types::CalendarSessionType

      def resolve(session_id:, hidden:)
        session = ::Session.find(session_id)

        (hidden ? ::Calendar::Hide : ::Calendar::Show).call(session:, user: current_user)

        Hashie::Mash.new(session:, hidden:, waitlisted: false)
      end
    end
  end
end
