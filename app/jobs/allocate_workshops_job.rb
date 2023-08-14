require Rails.root.join('lib/matchmaker')

class AllocateWorkshopsJob < ApplicationJob
  queue_as :default

  attr_reader :id

  def perform(id:, iterations: 100)
    @id = id
    Registrations::AllocateWorkshops.call(
      id:,
      iterations:,
      report_progress: method(:report_progress),
    )
  end

  def report_progress(progress:, total:, state: :working)
    NZIFSchema.subscriptions.trigger(
      :job_progress,
      { job_name: 'AllocateWorkshops', id: },
      { state:, progress:, total: },
    )
  end
end
