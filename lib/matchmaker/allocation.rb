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
        candidates.shift.place(sessions) do |bumped|
          candidates.unshift(bumped) if bumped.present?
        end
      end
    end

    def registrations
      @registrations ||= festival.registrations.completed.includes(:profile, preferences: :slot)
        .map { |r| Registration.new(r) }
        .reject(&:empty?)
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
      first_choices * never_bummed_out
    end

    def first_choices
      registrations.sum do |registration|
        registration.slots.values.count(1) / registration.candidates.size.to_f
      end / registrations.size.to_f
    end

    def never_bummed_out
      registrations.count { |r| r.bummed_out.zero? } / registrations.size.to_f
    end
  end
end
