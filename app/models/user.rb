class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :validatable

  include GraphqlDevise::Authenticatable
  include Preferences
  include Authorizable
  include Searchable

  has_one :profile, dependent: :nullify, inverse_of: :user, autosave: true

  before_validation :populate_profile

  preference :show_indigenous_names, type: :boolean, default: true,
    description: 'Show indigenous placenames'

  validates :name,
    presence: true,
    format: { with: /[^\s]+\s[^\s]+/ }

  searchable_on :name, :email

  private

  def populate_profile
    return if profile.present?

    build_profile(name:)
  end
end
