module Sources
  class Registrations < BaseSource
    def fetch(festival_ids)
      records = authorized(Registration.completed, type: :relation).where(festival_id: festival_ids)
      records = records.includes(:preferences, user: :profile)
      festival_ids.map { |id| records.select { |r| r.festival_id == id } }
    end
  end
end
