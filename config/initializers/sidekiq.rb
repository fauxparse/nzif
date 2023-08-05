if ENV['REDIS_TLS_URL']
  Sidekiq.configure_server do |config|
    config.redis = { url: ENV['REDIS_TLS_URL'] }
  end

  Sidekiq.configure_client do |config|
    config.redis = { url: ENV['REDIS_TLS_URL'] }
  end
end
