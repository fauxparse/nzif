source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '3.3.5'

# Bundle edge Rails instead: gem "rails", github: "rails/rails", branch: "main"
gem 'rails', '~> 7.1.2'

# The original asset pipeline for Rails [https://github.com/rails/sprockets-rails]
gem 'sprockets-rails'

# Use postgresql as the database for Active Record
gem 'pg', '~> 1.1'

# Use the Puma web server [https://github.com/puma/puma]
gem 'puma', '~> 6.6.0'

# Build JSON APIs with ease [https://github.com/rails/jbuilder]
gem 'jbuilder'

# Use Redis adapter to run Action Cable in production
# gem "redis", "~> 4.0"

# Use Kredis to get higher-level data types in Redis [https://github.com/rails/kredis]
# gem "kredis"

# Use Active Model has_secure_password [https://guides.rubyonrails.org/active_model_basics.html#securepassword]
# gem "bcrypt", "~> 3.1.7"

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: %i[mingw mswin x64_mingw jruby]

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', require: false

# Use Sass to process CSS
# gem "sassc-rails"

# Use Active Storage variants [https://guides.rubyonrails.org/active_storage_overview.html#transforming-images]
# gem "image_processing", "~> 1.2"

gem 'vite_rails', '~> 3.0'

gem 'apollo_upload_server', '2.1'
gem 'devise', '~> 4.9.4'
gem 'graphql', '~> 2.3.22'
gem 'graphql_devise', '~> 1.5.0'

gem 'auto_strip_attributes', '~> 2.6'
gem 'hashid-rails', '~> 1.4'
gem 'stringex', '~> 2.8'

gem 'hashie', '~> 5.0'

gem 'fiddle'
gem 'ostruct'

gem 'interactor-rails', github: 'fauxparse/interactor-rails'

gem 'contentful', '~> 2.16'

gem 'activerecord-postgres_enum'
gem 'activerecord_views', '~> 0.1.5'
gem 'geocoder', '~> 1.8'
gem 'geokit-rails', '~> 2.5'
gem 'pg_search', '~> 2.3'

gem 'action_policy', '~> 0.6.5'
gem 'action_policy-graphql', '~> 0.5.3'

gem 'acts_as_list', '~> 1.2.2'

gem 'blurhash', '~> 0.1.7'
gem 'image_processing', '~> 1.8'
gem 'shrine', '~> 3.6'

gem 'amatch', '~> 0.4.1'
gem 'countries', '~> 5.4'
gem 'i18n-active_record', '~> 1.3.0', require: 'i18n/active_record'

gem 'premailer-rails'

gem 'aws-sdk-s3', '~> 1.132.0'

gem 'redis', '~> 5.0'
gem 'sidekiq', '~> 7.3.0'

gem 'icalendar', '~> 2.9'

gem 'rest-client'

gem 'raygun4ruby'

gem 'money', '~> 6.16'
gem 'money-rails', '~> 1.12'
gem 'stripe'

gem 'sorted_set'

gem 'active_snapshot', '~> 0.3.1'

gem 'redcarpet', '~> 3.6'

gem 'clicksend_client', github: 'ClickSend/clicksend-ruby'
gem 'phony', '~> 2.20'

gem 'prawn', '~> 2.5.0'

gem 'matrix'

gem 'MailchimpMarketing', '~> 3.0'

group :development, :test do
  # See https://guides.rubyonrails.org/debugging_rails_applications.html#debugging-with-the-debug-gem
  gem 'debug', '~> 1.11.0', platforms: %i[mri mingw x64_mingw]
  gem 'dotenv-rails'

  gem 'rspec-rails', '~> 6.1.3'

  gem 'factory_bot_rails'

  gem 'rdoc'
end

group :development do
  # Use console on exceptions pages [https://github.com/rails/web-console]
  gem 'web-console'

  # Add speed badges [https://github.com/MiniProfiler/rack-mini-profiler]
  # gem "rack-mini-profiler"

  # Speed up commands on slow machines / big apps [https://github.com/rails/spring]
  # gem "spring"

  gem 'rubocop', '~> 1.69'
  gem 'rubocop-capybara', '~> 2.22'
  gem 'rubocop-factory_bot', '~> 2.26'
  gem 'rubocop-graphql', '~> 1.5'
  gem 'rubocop-rails', '~> 2.29'
  gem 'rubocop-rspec', '~> 3.4'
  gem 'rubocop-rspec_rails', '~> 2.30'
  gem 'seed-fu', '~> 2.3'
  gem 'standard', '>= 1.35.1'

  gem 'letter_opener'

  gem 'ruby-lsp-rails', '~>0.4.6'
end

group :test do
  gem 'capybara', '~> 3.39'
  gem 'cucumber', '~> 8.0', require: false
  gem 'cucumber-rails', '~> 2.6', require: false
  gem 'cuprite', '~> 0.14.3'

  gem 'rspec-collection_matchers', require: false
  gem 'rspec-its', require: false
  gem 'shoulda-matchers', require: false
  gem 'simplecov', require: false
  gem 'simplecov-summary', require: false

  gem 'database_cleaner', '~> 2.0'

  gem 'action_mailer_cache_delivery', '~> 0.4.0'
  gem 'email_spec', '~> 2.2'

  gem 'puffing-billy', '~> 4.0.0'
  gem 'webmock', '~> 3.18'
end

group :development, :test, :staging do
  gem 'graphiql-rails'
  gem 'mailsafe'
end

gem "airrecord", "~> 1.0"
