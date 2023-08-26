require_relative './production'

Rails.application.configure do
  config.action_mailer.default_url_options = { host: 'staging.improvfest.nz' }
end

Mailsafe.setup do |config|
  config.allowed_domain = 'improvfest.nz'
  config.prefix_email_subject_with_rails_env = true
end
