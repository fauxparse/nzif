module Sources
  class WorkshopsCount < BaseSource
    attr_reader :festival

    def initialize(context:, festival:)
      super(context:)
      @festival = festival
    end

    def fetch(registration_ids)
      results =
        if festival.earlybird?
          Preference
            .where(position: 1)
            .group('preferences.registration_id')
            .pluck(:registration_id, Arel.sql('COUNT(DISTINCT(preferences.id))')).to_h
        else
          Placement
            .group('placements.registration_id')
            .pluck(:registration_id, Arel.sql('COUNT(DISTINCT(placements.id))')).to_h
        end

      registration_ids.map do |id|
        results[id] || 0
      end
    end
  end
end
