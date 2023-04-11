class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :validatable

  include GraphqlDevise::Authenticatable
  include Preferences
  include Authorizable
  include Searchable

  preference :show_indigenous_names, type: :boolean, default: true,
    description: 'Show indigenous placenames'

  validates :name,
    presence: true,
    format: { with: /[^\s]+\s[^\s]+/ }

  searchable_on :name, :email
end
