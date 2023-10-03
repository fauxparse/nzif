namespace :feedback do
  desc 'Send email reminders to fill out workshop feedback forms'
  task send_reminders: :environment do
    WorkshopFeedbackRemindersJob.perform_later
  end
end
