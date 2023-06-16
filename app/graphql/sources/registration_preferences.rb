module Sources
  class RegistrationPreferences < BaseSource
    def fetch(registration_ids)
      records = Preference
        .includes(session: :activity)
        .where(registration_id: registration_ids)
        .index_by(&:registration_id)
        .to_h(&method(:group_preferences))
      registration_ids.map { |id| records[id] || [] }
    end

    private

    def group_preferences(registration_id, preferences)
      [
        registration_id,
        preferences.group_by { |p| p.session.starts_at }.map do |starts_at, ps|
          Hashie::Mash.new({
            id: "#{registration_id}:#{starts_at}",
            starts_at:,
            ends_at: ps.first.session.ends_at,
            workshops: ps.sort_by(&:position).map(&:workshop),
          })
        end,
      ]
    end
  end
end
