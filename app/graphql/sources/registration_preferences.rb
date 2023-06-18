module Sources
  class RegistrationPreferences < BaseSource
    def fetch(registration_ids)
      records = Preference
        .includes(session: :activity)
        .where(registration_id: registration_ids)
        .group_by(&:registration_id)
      registration_ids.map { |id| records[id] || [] }
    end
  end
end
