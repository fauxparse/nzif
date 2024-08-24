module Registrations
  class AllocateWorkshops < ApplicationInteractor
    delegate :allocation, :id, :best, to: :context

    def call
      skip_authorization!
      data = find_best_allocation
      allocation.update!(
        data:,
        score: data.score * 100,
        completed_at: Time.zone.now,
      )
      report_progress(progress: iterations, total: iterations, state: :completed)
    end

    def iterations
      context[:iterations] ||= 100
    end

    def allocation
      context[:allocation] ||= Allocation.includes(:festival).find(id)
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
  end
end
