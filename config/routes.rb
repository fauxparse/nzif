require 'sidekiq/web'

Rails.application.routes.draw do
  mount Shrine.presign_endpoint(:cache) => '/s3/params'

  unless Rails.env.production?
    mount GraphiQL::Rails::Engine, at: '/graphiql',
      graphql_path: '/graphql'
    mount Sidekiq::Web => '/sidekiq'
  end

  post '/graphql', to: 'graphql#execute'

  constraints Domains::Short do
    get '/:id', to: 'short_urls#redirect', as: :short
  end

  resource :directory, only: :show do
    get '*path', to: 'directories#show'
  end

  resources :countries, only: :index, defaults: { format: :json }

  resources :calendars, only: :show, constraints: { format: 'ics', protocol: 'webcal' }

  post '/payment_intents', to: 'payments#create_intent', defaults: { format: :json }
  post '/payments', to: 'payments#webhook', defaults: { format: :json }

  get '/register/workshops', to: 'festivals#show', as: :registration
  get '/register/payment', to: 'festivals#show', as: :payment

  get '/calendar', to:  'festivals#show', as: :personal_calendar

  get '/workshops/:slug', to: 'festivals#show', as: :workshop

  get '/waitlist/:id', to: 'festivals#show', as: :accept_waitlist

  get '/feedback/:id', to: 'festivals#show', as: :session_feedback

  get '/charts/preferences', to: 'charts#preferences', as: :preferences_chart

  get '*path', to: 'festivals#show'
  root to: 'festivals#show'
end
