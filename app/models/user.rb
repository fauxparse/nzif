class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :validatable

  include GraphqlDevise::Authenticatable
  include Settings
  include Authorizable
  include Searchable

  has_one :profile, dependent: :nullify, inverse_of: :user, autosave: true
  has_many :registrations, dependent: :restrict_with_exception, inverse_of: :user

  before_validation :populate_profile

  validates :name,
    presence: true,
    format: { with: Profile::NAME_FORMAT }

  setting :show_traditional_names, type: :boolean, default: true,
    description: 'Show traditional placenames'

  searchable_on :name, :email

  private

  def populate_profile
    return if profile.present?

    build_profile(name:)
  end
end
