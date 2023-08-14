module Matchmaker
  class Session
    include Enumerable

    attr_reader :session, :candidates, :waitlist, :capacity

    def initialize(session, capacity: session.capacity || 16)
      @session = session
      @capacity = capacity
      @candidates = SortedSet.new
      @waitlist = SortedSet.new
    end

    delegate :starts_at, :activity, :slot, to: :session

    delegate :size, :each, to: :candidates

    def id
      session.to_param
    end

    def place(candidate)
      candidates << candidate

      return if candidates.size <= capacity

      bumped = candidates.to_a.last
      candidates.delete(bumped)
      waitlist << bumped
      candidate.bump_from(self)

      yield bumped if block_given?
    end
  end
end
