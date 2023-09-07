module Matchmaker
  class Validate
    include Interactor

    delegate :allocation, to: :context

    def call
      validate_all_sessions_present!
      validate_capacities!
      validate_no_dupes!
      validate_everyone_on_waitlists!
    end

    def festival
      @festival ||=
        Festival
          .includes(sessions: %i[placements activity], registrations: { preferences: :session })
          .find(context.festival_id)
    end

    private

    def festival_session(id)
      festival.sessions.detect { |s| s.to_param == id }
    end

    def validate_all_sessions_present!
      allocation_session_ids = allocation.sessions.keys.sort
      festival_session_ids = festival.sessions
        .select { |s| s.activity_type == ::Workshop }
        .map(&:to_param)
        .sort

      raise 'mismatched sessions' unless allocation_session_ids == festival_session_ids
    end

    def validate_capacities!
      allocation.sessions.each do |session_id, session|
        allocation_count = session.placements.size
        capacity = festival_session(session_id).capacity

        if allocation_count > capacity
          raise "#{festival_session(session_id).activity.name} over capacity (#{allocation_count} > #{capacity})"
        end
      end
    end

    def validate_no_dupes!
      allocation.sessions.values.group_by(&:starts_at).each do |_starts_at, sessions|
        ids = sessions.flat_map { |s| s.placements.map(&:id) }
        next unless ids.uniq.size != ids.size

        sets = sessions.map { |s| [s, Set.new(s.placements)] }
        sets.combination(2) do |(s1, r1), (s2, r2)|
          intersection = r1 & r2
          if intersection.any?
            raise "#{intersection.map(&:name).inspect} in both #{s1.name} and #{s2.name}"
          end
        end
      end
    end

    def validate_everyone_on_waitlists!
      allocation.sessions.values.group_by(&:starts_at).each do |_starts_at, sessions|
        session_ids = Set.new(sessions.map(&:id))
        allocated_ids = Set.new(
          sessions.flat_map { |s| s.placements.map(&:id) + s.waitlist.map(&:id) },
        )
        requested_ids = Set.new(
          festival.registrations.select do |r|
            r.completed? && r.preferences.detect { |p| session_ids.include?(p.session.to_param) }
          end.map(&:to_param),
        )
        next if allocated_ids == requested_ids

        not_allocated = (requested_ids - allocated_ids).map { |id| allocation.registrations[id] }
        puts not_allocated.map(&:preferences).inspect
      end
    end
  end
end
