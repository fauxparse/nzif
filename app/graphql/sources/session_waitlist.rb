module Sources
  class SessionWaitlist < BaseSource
    def fetch(session_ids)
      records = Waitlist.includes(registration: { user: :profile })
        .where(session_id: session_ids)
        .group_by(&:session_id)
      session_ids.map { |id| (records[id] || []).sort_by(&:position) }
    end
  end
end
