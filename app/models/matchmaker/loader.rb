module Matchmaker
  class Loader
    attr_reader :festival

    def initialize(festival)
      @festival = Festival
        .includes(
          registrations: [:user, { preferences: :session }, { placements: :session }],
          sessions: [:slot, :activity, { placements: :session }, :waitlist],
        )
        .find(festival.id)
    end

    def as_json
      {
        sessions: sessions_data,
        registrations: registrations_data,
      }
    end

    def sessions
      festival.sessions.select { |a| a.activity.is_a?(Workshop) }
    end

    def registrations
      @registrations ||= festival.registrations.select do |r|
        r.completed? && r.preferences.any?
      end
    end

    private

    def sessions_data
      sessions.map do |s|
        {
          id: s.to_param,
          starts_at: s.starts_at.iso8601,
          activity_id: s.activity.to_param,
          name: s.activity.name,
          capacity: s.capacity,
          placements: s.placements.map { |p| ::Registration.encode_id(p.registration_id) },
          waitlist: s.waitlist.map { |w| ::Registration.encode_id(w.registration_id) },
        }
      end
    end

    def registrations_data
      registrations.map do |r|
        placed = Set.new(r.placements.flat_map { |p| p.session.starts_at.iso8601 })

        {
          id: r.to_param,
          name: r.user.name,
          preferences: preferences_data(r, placed),
        }
      end
    end

    def preferences_data(registration, placed)
      registration.preferences
        .group_by { |p| p.session.starts_at.iso8601 }
        .except(*placed)
        .transform_values { |ps| ps.sort_by(&:position).map { |p| p.session.to_param } }
    end
  end
end
