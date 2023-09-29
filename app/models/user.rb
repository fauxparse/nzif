class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
    :recoverable, :rememberable, :validatable

  include GraphqlDevise::Authenticatable
  include Settings
  include Authorizable
  include Searchable

  has_one :profile, dependent: :nullify, inverse_of: :user, autosave: true
  has_many :registrations, dependent: :restrict_with_exception, inverse_of: :user
  has_many :ownerships, dependent: :destroy, inverse_of: :user
  has_many :profiles, through: :ownerships
  has_many :activity_owners, as: :user # rubocop:disable Rails/HasManyOrHasOneDependent
  has_many :activities, through: :activity_owners, source_type: 'Activity'

  before_validation :populate_profile

  validates :name,
    presence: true,
    format: { with: Profile::NAME_FORMAT }

  setting :show_traditional_names, type: :boolean, default: true,
    description: 'Show traditional placenames'

  searchable_on :name, :email

  def self.automaton
    @automaton ||=
      find_or_create_by!(email: 'registrations@improvfest.nz') do |user|
        user.name = 'NZIF bot'
        user.password = user.password_confirmation = SecureRandom.hex(32)
        user.permissions << :registrations
        user.permissions << :activities
      end
  end

  private

  def populate_profile
    return if profile.present?

    build_profile(name:)
  end
end
