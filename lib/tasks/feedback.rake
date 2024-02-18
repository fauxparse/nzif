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
end
