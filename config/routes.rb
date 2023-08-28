require 'sidekiq/web'

Rails.application.routes.draw do
  unless Rails.env.production?
    mount GraphiQL::Rails::Engine, at: '/graphiql',
      graphql_path: '/graphql'
    mount Sidekiq::Web => '/sidekiq'
  end

  post '/graphql', to: 'graphql#execute'

  constraints Domains::Short do
    get '/:id', to: 'short_urls#redirect', as: :short
  end

  resources :countries, only: :index, defaults: { format: :json }

  get '/register/workshops', to: 'festivals#show', as: :registration
  get '/register/payment', to: 'festivals#show', as: :payment

  get '/workshops/:slug', to: 'festivals#show', as: :workshop

  get '*path', to: 'festivals#show'
  root to: 'festivals#show'
end
