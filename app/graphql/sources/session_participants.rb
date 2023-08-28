module Sources
  class SessionParticipants < BaseSource
    def fetch(session_ids)
      records = Placement.includes(registration: { user: :profile })
        .where(session_id: session_ids)
        .group_by(&:session_id)
      session_ids.map { |id| (records[id] || []).map(&:registration) }
    end
  end
end
