require 'sidekiq/web'

Rails.application.routes.draw do
  mount GraphiQL::Rails::Engine, at: '/graphiql', graphql_path: '/graphql' if Rails.env.development?
  post '/graphql', to: 'graphql#execute'

  mount Sidekiq::Web => '/sidekiq' if Rails.env.development?

  resources :countries, only: :index, defaults: { format: :json }

  get '/register/workshops', to: 'festivals#show', as: :registration

  get '*path', to: 'festivals#show'
  root to: 'festivals#show'
end
