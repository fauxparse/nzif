class Profile < ApplicationRecord
  include ProfilePictureUploader::Attachment(:picture)
  include Searchable
  include Localizable

  has_paper_trail

  belongs_to :user, optional: true, inverse_of: :profile
  has_many :cast, dependent: :destroy, inverse_of: :profile
  has_many :activities, through: :cast, source: :activity

  validates :name, presence: true

  searchable_on :name

  scope :without_attached_user, -> { where(user_id: nil) }
end
