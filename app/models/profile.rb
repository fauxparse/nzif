class Profile < ApplicationRecord
  include ProfilePictureUploader::Attachment(:picture)
  include Searchable
  include Localizable

  belongs_to :user, optional: true, inverse_of: :profile

  validates :name, presence: true

  searchable_on :name

  scope :without_attached_user, -> { where(user_id: nil) }
end
