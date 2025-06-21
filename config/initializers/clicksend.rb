require 'clicksend_client'

ClickSendClient.configure do |config|
  credentials = Rails.application.credentials.clicksend
  if credentials.present?
    config.username = credentials[:username]
    config.password = credentials[:api_key]
  end
end
