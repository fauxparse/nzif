module Registrations
  class AllocatePlacements < ApplicationInteractor
    delegate :festival, to: :context

    def seed
      context[:seed] ||= Random.new_seed
    end

    def sessions
      @sessions ||= festival
        .sessions
        .where(sessions: { activity_type: 'Workshop' })
        .where.not(sessions: { activity_id: nil })
    end

    def registrations
      @registrations = festival.registrations.completed.includes(:preferences)
    end
  end
end
