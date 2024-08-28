module Sources
  class SessionsByTutor < BaseSource
    def fetch(profile_ids)
      records = Session
        .includes(activity: :cast)
        .references(:activities, :cast)
        .where(activity: { type: 'Workshop' }, cast: { profile_id: profile_ids })

      profile_ids.map do |id|
        records.select do |r|
          r.activity.cast.any? do |c|
            c.profile_id == id
          end
        end
      end
    end
  end
end
