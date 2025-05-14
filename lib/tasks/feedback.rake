namespace :feedback do
  desc 'Send email reminders to fill out workshop feedback forms'
  task send_reminders: :environment do
    WorkshopFeedbackRemindersJob.perform_later
  end

  desc 'Generate a feedback report'
  task :report, [:filename] => [:environment] do |_, args|
    FeedbackReport.new(festival: Festival.last).generate(filename: args[:filename])
    `open #{args[:filename]}`
  end

  desc 'Generate a printable version of the workshop feedback'
  task print: :environment do
    workshops = Workshop.scheduled.where(festival: Festival.last).includes(:feedback, cast: :profile)

    workshops.each do |workshop|
      output = Rails.root.join("tmp/feedback/#{workshop.slug}.pdf")
      printer = FeedbackPrinter.new([workshop])
      printer.render_file(output)
    end
  end
end
