class Profile < ApplicationRecord
  include ProfilePictureUploader::Attachment(:picture)
  include Searchable
  include Localizable

  belongs_to :user, optional: true, inverse_of: :profile
  has_many :cast, dependent: :destroy, inverse_of: :profile
  has_many :activities, through: :cast, source: :activity
  has_many :ownerships, dependent: :destroy, inverse_of: :profile
  has_many :owners, through: :ownerships, source: :user

  NAME_FORMAT = /(CB|([^\s]+(\s+[^\s]+)+))/i

  validates :name,
    presence: true,
    format: { with: NAME_FORMAT }
  validates :phone, length: { in: 0..32 }, allow_blank: true

  searchable_on :name

  scope :without_attached_user, -> { where(user_id: nil) }
  scope :registered, lambda {
    joins(
      <<~SQL.squish,
        INNER JOIN users
        ON profiles.user_id = users.id
        INNER JOIN registrations
        ON registrations.user_id = users.id
      SQL
    )
  }

  def uploaded_picture=(value)
    self.picture = {
      id: value[:id],
      storage: 'cache',
      metadata: {
        size: value[:size],
        filename: value[:filename],
        mime_type: value[:mime_type],
      },
    }
  end
end
