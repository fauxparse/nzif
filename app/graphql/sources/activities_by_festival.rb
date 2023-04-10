module Sources
  class ActivitiesByFestival < BaseSource
    attr_reader :type

    def initialize(context:, type: nil)
      super(context:)
      @type = type
    end

    def fetch(festival_ids)
      records = authorized(Activity, type: :relation).where(festival_id: festival_ids)
      records = records.where(type: type.to_s) if type.present?
      festival_ids.map { |id| records.select { |r| r.festival_id == id } }
    end
  end
end
