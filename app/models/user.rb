class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :validatable

  include GraphqlDevise::Authenticatable
  include Settings
  include Authorizable
  include Searchable

  has_one :profile, dependent: :nullify, inverse_of: :user, autosave: true

  before_validation :populate_profile

  setting :show_traditional_names, type: :boolean, default: true,
    description: 'Show traditional placenames'

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
