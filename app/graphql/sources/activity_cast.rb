module Sources
  class ActivityCast < BaseSource
    attr_reader :role

    def initialize(context:, role: nil)
      super(context:)
      @role = role
    end

    def fetch(activity_ids)
      records = Cast.where(activity_id: activity_ids).includes(profile: :user)
      records = records.where(role:) if role
      activity_ids.map { |id| records.select { |r| r.activity_id == id } }
    end
  end
end
