module Sources
  class FestivalPresenters < BaseSource
    def fetch(festival_ids)
      records = Profile
        .includes(profile_activities: :activity)
        .references(:activities)
        .where(activities: { festival_id: festival_ids })
        .order(name: :asc)

      festival_ids.map do |id|
        records.select do |profile|
          profile.profile_activities.any? do |pa|
            pa.activity.festival_id == id
          end
        end
      end
    end
  end
end
