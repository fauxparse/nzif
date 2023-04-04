module Sources
  class ActivitiesByFestival < GraphQL::Dataloader::Source
    attr_reader :type

    def initialize(type: nil)
      super()
      @type = type
    end

    def fetch(festival_ids)
      records = Activity.where(festival_id: festival_ids)
      records = records.where(type: type.to_s) if type.present?
      festival_ids.map { |id| records.select { |r| r.festival_id == id } }
    end
  end
end
