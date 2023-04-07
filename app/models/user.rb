class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :validatable

  include GraphqlDevise::Authenticatable
  include Preferences

  preference :show_indigenous_names, type: :boolean, default: true,
    description: 'Show indigenous placenames'
end
