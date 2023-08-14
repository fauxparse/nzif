module Registrations
  class AllocateWorkshops < ApplicationInteractor
    delegate :allocation, :id, :best, to: :context

    def call
      best = find_best_allocation
      save(best)
      report_progress(progress: iterations, total: iterations, state: :completed)
    end

    def iterations
      context[:iterations] ||= 100
    end

    def allocation
      context[:allocation] = Allocation.includes(:festival).find(id)
    end

    private

    def find_best_allocation
      best = nil

      iterations.times do |i|
        report_progress(progress: i, total: iterations)
        a = Matchmaker.allocate(festival: allocation.festival)
        best = a if !best || a.score > best.score
      end

      best
    end

    def report_progress(progress:, total:, state: :working)
      context[:report_progress]&.call(progress:, total:, state:)
    end

    def save(best)
      sessions = best.sessions.values.map do |session|
        {
          id: session.id,
          starts_at: session.starts_at,
          activity_id: session.activity.to_param,
          registrations: session.candidates.map(&:id),
          waitlist: session.waitlist.map(&:id),
        }
      end

      allocation.update!(
        score: best.score * 100_00,
        original: { sessions: },
      )
    end
  end
end
