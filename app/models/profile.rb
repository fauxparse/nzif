class Profile < ApplicationRecord
  include ProfilePictureUploader::Attachment(:picture)

  belongs_to :user, optional: true, inverse_of: :profile

  validates :name, presence: true

  scope :without_attached_user, -> { where(user_id: nil) }
end
