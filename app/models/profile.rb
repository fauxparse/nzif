class Profile < ApplicationRecord
  include ProfilePictureUploader::Attachment(:picture)
  include Searchable
  include Localizable

  belongs_to :user, optional: true, inverse_of: :profile
  has_many :castings, class_name: 'Person', dependent: :destroy, inverse_of: :profile
  has_many :activities, through: :castings, source: :activity

  validates :name, presence: true

  searchable_on :name

  scope :without_attached_user, -> { where(user_id: nil) }
end
