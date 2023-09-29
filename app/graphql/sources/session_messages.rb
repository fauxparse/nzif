module Sources
  class SessionMessages < BaseSource
    def fetch(session_ids)
      messages = Message
        .where(messageable_type: 'Session', messageable_id: session_ids)
        .order(created_at: :asc)
        .includes(:sender)
        .group_by(&:messageable_id)

      session_ids.map { |id| messages[id] || [] }
    end
  end
end
