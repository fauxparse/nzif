require 'clicksend_client'

ClickSendClient.configure do |config|
  credentials = Rails.application.credentials.clicksend
  config.username = credentials[:username]
  config.password = credentials[:api_key]
end
