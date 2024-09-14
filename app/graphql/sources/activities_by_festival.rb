module Sources
  class ActivitiesByFestival < BaseSource
    attr_reader :type, :scheduled_only

    def initialize(context:, type: nil, scheduled_only: false)
      super(context:)
      @type = type
      @scheduled_only = scheduled_only
    end

    def fetch(festival_ids)
      records = authorized(Activity, type: :relation).where(festival_id: festival_ids)
      records = records.where(type: type.to_s) if type.present?
      records = records.scheduled if scheduled_only
      festival_ids.map { |id| records.select { |r| r.festival_id == id }.uniq(&:id) }
    end
  end
end
