module Sources
  class RegistrationPreferences < BaseSource
    def fetch(registration_ids)
      records = Preference
        .includes(session: %i[activity session_slots])
        .where(registration_id: registration_ids)
        .group_by(&:registration_id)
      registration_ids.map { |id| records[id] || [] }
    end
  end
end
