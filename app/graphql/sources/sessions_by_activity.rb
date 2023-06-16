module Sources
  class SessionsByActivity < BaseSource
    def fetch(activity_ids)
      records = Session.where(activity_id: activity_ids)
      activity_ids.map { |id| records.select { |r| r.activity_id == id } }
    end
  end
end
