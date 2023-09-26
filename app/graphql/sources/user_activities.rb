module Sources
  class UserActivities < BaseSource
    def fetch(ids)
      activities = ActivityOwner
        .includes(:activity)
        .where(user_id: ids)
        .group_by(&:user_id)

      ids.map { |id| activities[id]&.map(&:activity) || [] }
    end
  end
end
