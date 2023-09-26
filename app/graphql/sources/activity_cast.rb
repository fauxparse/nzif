module Sources
  class ActivityCast < BaseSource
    attr_reader :role, :activity_type

    def initialize(context:, activity_type: 'Activity', role: nil)
      super(context:)
      @activity_type = activity_type
      @role = role
    end

    def fetch(activity_ids)
      records = Cast.where(activity_type:, activity_id: activity_ids).includes(profile: :user)
      records = records.where(role:) if role
      activity_ids.map { |id| records.select { |r| r.activity_id == id } }
    end
  end
end
