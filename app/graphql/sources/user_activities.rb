module Sources
  class UserActivities < BaseSource
    def fetch(ids)
      activities = ActivityOwner
        .includes(:activity)
        .where(user_id: ids)
        .where(role: %w[director tutor organiser speaker host])
        .group_by(&:user_id)

      ids.map { |id| activities[id]&.map(&:activity) || [] }
    end
  end
end
