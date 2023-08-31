module Sources
  class RegistrationWaitlist < BaseSource
    def fetch(registration_ids)
      records = Waitlist
        .includes(session: %i[slot activity])
        .where(registration_id: registration_ids)
        .group_by(&:registration_id)
      registration_ids.map { |id| records[id]&.map(&:session) || [] }
    end
  end
end
