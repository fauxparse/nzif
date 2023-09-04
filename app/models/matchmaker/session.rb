module Matchmaker
  class Session
    include Enumerable

    attr_reader :session, :candidates, :waitlist, :capacity

    def initialize(session, capacity: session.capacity || 16)
      @session = session
      @capacity = capacity
      @candidates = Set.new
      @waitlist = Set.new
    end

    delegate :starts_at, :activity, :slot, to: :session

    delegate :size, :each, to: :candidates

    def id
      session.to_param
    end

    def place(candidate, &) # rubocop:disable Metrics/AbcSize
      return if candidates.find { |c| c.id == candidate.id }

      candidates << candidate

      return if candidates.size <= capacity

      bumped = candidates.max_by { |c| c.score * c.registration.preferences.size }
      candidates.delete(bumped)

      waitlist << bumped
      candidate.bump_from(self)

      yield bumped if block_given?
    end

    def remove(candidate)
      candidates.delete(candidate)
      waitlist.delete(candidate)
    end

    def as_json(*)
      {
        id:,
        starts_at:,
        activity_id: activity.to_param,
        registrations: candidates.to_a.sort_by(&:score).map(&:id),
        waitlist: waitlist.to_a.sort_by(&:score).map(&:id),
        capacity:,
      }
    end
  end
end
