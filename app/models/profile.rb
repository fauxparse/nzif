class Profile < ApplicationRecord
  include ProfilePictureUploader::Attachment(:picture)
  include Searchable
  include Localizable

  has_paper_trail

  belongs_to :user, optional: true, inverse_of: :profile
  has_many :cast, dependent: :destroy, inverse_of: :profile
  has_many :activities, through: :cast, source: :activity

  NAME_FORMAT = /(CB|([^\s]+(\s+[^\s]+)+))/i

  validates :name,
    presence: true,
    format: { with: NAME_FORMAT }
  validates :phone, length: { in: 0..32 }, allow_blank: true

  searchable_on :name

  scope :without_attached_user, -> { where(user_id: nil) }
end
