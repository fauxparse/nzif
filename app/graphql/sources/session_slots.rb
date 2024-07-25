module Sources
  class SessionSlots < BaseSource
    def fetch(session_ids)
      records = SessionSlot
        .where(session_id: session_ids)
        .group_by(&:session_id)
      session_ids.map { |id| (records[id] || []) }
    end
  end
end
