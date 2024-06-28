module Sources
  class AppearancesByPresenter < BaseSource
    attr_reader :festival

    def initialize(context:, festival:)
      super(context:)
      @festival = festival
    end

    def fetch(presenter_ids)
      records = ProfileActivity
        .includes(activity: :sessions)
        .references(:activity)
        .where(activity: { festival_id: festival.id })
        .where({ profile_id: presenter_ids })

      presenter_ids.map do |id|
        records.select { |a| a.profile_id == id }
      end
    end
  end
end
