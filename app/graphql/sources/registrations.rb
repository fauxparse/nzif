module Sources
  class Registrations < BaseSource
    attr_reader :name

    def initialize(context:, name: nil)
      super(context:)
      @name = name
    end

    def fetch(festival_ids)
      # records = authorized(Registration.completed, type: :relation).where(festival_id: festival_ids)
      records = Registration.completed.where(festival_id: festival_ids)
      records = records.includes(:preferences, user: :profile)
        .references(:preferences, :users, :profiles)
      records = records.merge(Profile.search(name)) if name.present?
      festival_ids.map { |id| records.select { |r| r.festival_id == id } }
    end
  end
end
