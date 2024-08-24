# rubocop:disable Metrics/ParameterLists

module Matchmaker
  class Session
    attr_reader :id, :name, :starts_at, :activity_id, :capacity, :placements, :waitlist, :slots

    def initialize(
      allocation:,
      id:,
      name:,
      starts_at:,
      activity_id:,
      capacity:,
      placements:,
      waitlist:,
      slots:
    )
      @allocation = allocation
      @id = id
      @name = name
      @starts_at = starts_at
      @activity_id = activity_id
      @capacity = capacity
      @placements = SortedList.new(self, placements.map { |p| allocation.registrations[p] })
      @waitlist = SortedList.new(self, waitlist.map { |w| allocation.registrations[w] })
      @slots = slots

      @placements.each { |p| p.placed_in(self) }
    end

    def place(registration, &)
      return if placements.include?(registration)

      placements << registration

      waitlist.delete(registration)

      if placements.size <= capacity
        registration.placed_in(self)
        return
      end

      bumped = placements.pop

      registration.placed_in(self) unless bumped == registration

      waitlist << bumped
      next_candidates = bumped.bump_from(self)

      yield next_candidates if next_candidates&.any? && block_given?
    end

    def remove(registration)
      placements.delete(registration)
      waitlist.delete(registration)
      registration.bump_from(self)
    end

    def as_json
      {
        id:,
        starts_at:,
        activity_id:,
        name:,
        capacity:,
        placements: placements.map(&:id),
        waitlist: waitlist.map(&:id),
        slots:,
      }
    end
  end
end

# rubocop:enable Metrics/ParameterLists
