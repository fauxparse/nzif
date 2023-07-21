require 'webmock/cucumber'
require 'billy/capybara/cucumber'

WebMock.allow_net_connect!

Billy.configure do |config|
  config.cache = true
  config.cache_request_headers = false
  config.persist_cache = true
  config.non_successful_cache_disabled = false
  config.non_successful_error_level = :warn
  config.cache_path = 'features/mocks/'
  config.certs_path = 'tmp/certs'
  config.cache_whitelist = ["https://graphql.contentful.com/content/v1/spaces/#{Rails.application.credentials.contentful.space}"]
  config.record_requests = true
end

Before do
  Capybara.current_driver = :cuprite_billy unless ENV['HEADLESS'].in?(%w[n 0 no false])
end

After do
  Capybara.use_default_driver
end
