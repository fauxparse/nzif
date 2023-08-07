ActionMailer::Base.smtp_settings = {
  domain: 'improvfest.nz',
  address: 'smtp.sendgrid.net',
  port: 587,
  authentication: :plain,
  user_name: 'apikey',
  password: ENV.fetch('SENDGRID_API_KEY', nil),
}
