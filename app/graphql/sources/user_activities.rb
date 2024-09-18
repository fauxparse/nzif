module Sources
  class UserActivities < BaseSource
    attr_reader :festival

    def initialize(context:, festival:)
      super(context:)
      @festival = festival
    end

    def fetch(ids)
      activities = ActivityOwner
        .includes(:activity)
        .where(user_id: ids)
        .where(role: %w[director tutor organiser speaker host])
        .select { |a| a.activity.festival_id == festival.id }
        .uniq(&:activity_id)
        .group_by(&:user_id)

      ids.map do |id|
        activities[id]&.map(&:activity) || []
      end
    end
  end
end
