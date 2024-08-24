module Matchmaker
  class Loader
    attr_reader :festival

    def initialize(festival)
      @festival = Festival
        .includes(
          registrations: [
            :user,
            { preferences: { session: :session_slots } },
            { placements: :session },
          ],
          sessions: [:session_slots, :activity, { placements: :session }, :waitlist],
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
          slots: s.session_slots.map(&:date_with_period),
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
        .flat_map { |p| p.session.session_slots.map { |s| [s.date_with_period, p] } }
        .group_by(&:first)
        .transform_values { |ps| ps.map(&:last) }
        .except(*placed)
        .transform_values do |ps|
        ps.sort_by(&:position).to_h do |p|
          [p.position, p.session.to_param]
        end
      end
    end
  end
end
