class AllocateWorkshopsJob < ApplicationJob
  queue_as :default

  attr_reader :id, :step

  def perform(id:, iterations: 10, step: 1)
    @id = id
    @step = step
    Registrations::AllocateWorkshops.call(
      id:,
      iterations:,
      report_progress: method(:report_progress),
    )
  end

  def report_progress(progress:, total:, state: :working)
    return unless progress < step || progress > total - step || (progress % step).zero?

    NZIFSchema.subscriptions.trigger(
      :job_progress,
      { job_name: 'AllocateWorkshops', id: },
      { state:, progress:, total: },
    )
  end
end
