module Sources
  class ProfileUser < BaseSource
    def fetch(profile_ids)
      records = User
        .joins(:profile)
        .where(profiles: { id: profile_ids })
        .select('users.*, profiles.id AS profile_id')
        .index_by(&:profile_id)
      profile_ids.map { |id| records[id] }
    end
  end
end
