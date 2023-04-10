class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :validatable

  include GraphqlDevise::Authenticatable
  include Preferences
  include Authorizable

  preference :show_indigenous_names, type: :boolean, default: true,
    description: 'Show indigenous placenames'

  validates :name,
    presence: true,
    format: { with: /\s/ }
end
