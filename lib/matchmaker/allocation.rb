module Matchmaker
  class Allocation
    attr_accessor :festival, :random, :capacity

    def initialize(festival:, seed: Random.new_seed, capacity: nil)
      @festival = festival
      @random = Random.new(seed)
      @capacity = capacity
      process
    end

    def process
      while candidates.any?
        candidate = candidates.shift
        candidate.place(sessions) do |bumped|
          candidates.unshift(bumped) if bumped.present?
        end
      end
    end

    def registrations
      @registrations ||= festival.registrations.completed.includes(:profile, preferences: :slot)
        .map { |r| Registration.new(r) }
    end

    def candidates
      @candidates ||= registrations.flat_map(&:candidates).shuffle(random:)
    end

    def sessions
      @sessions ||= festival.sessions.includes(:slot, :activity)
        .where(activity_type: 'Workshop')
        .where.not(activity_id: nil)
        .map { |s| Session.new(s, capacity: capacity || s.capacity) }
        .index_by(&:id)
    end

    def score
      average_score * never_bummed_out
    end

    def average_score
      return 0 if registrations.empty?

      registrations.sum(&:score) / registrations.size.to_f
    end

    def never_bummed_out
      return 0 if registrations.empty?

      registrations.count { |r| r.bummed_out.zero? } / registrations.size.to_f
    end
  end
end
