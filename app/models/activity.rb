class Activity < ApplicationRecord
  include ActivityPictureUploader::Attachment(:picture)
  include Sluggable
  include Searchable
  include Castable

  enum :type, :activity_type

  sluggable scope: %i[festival_id type]

  belongs_to :festival
  has_many :sessions, inverse_of: :activity, dependent: :nullify
  has_many :slots, through: :sessions
  has_many :activity_owners, as: :activity # rubocop:disable Rails/HasManyOrHasOneDependent
  has_many :profile_activities # rubocop:disable Rails/HasManyOrHasOneDependent
  has_many :owners, through: :activity_owners, source: :user
  has_many :feedback, through: :sessions

  searchable_on :name, :description

  validates :booking_link,
    absence: { unless: :show? }
  validates :suitability,
    absence: { unless: :workshop? }

  scope :by_type, ->(type) { where(type: type.to_s) }
  scope :scheduled, -> { joins('INNER JOIN sessions ON sessions.activity_id = activities.id') }

  after_save do
    next unless saved_change_to_picture_data? && picture(:tiny).present?

    image = MiniMagick::Image.open(picture(:tiny).url)
    width, height = image.dimensions
    pixels = image.get_pixels.flatten(1).map { |r, g, b| (r * 65_536) + (g * 256) + b }
    update!(blurhash: Blurhash.encode(width, height, pixels))
  end

  def self.to_param
    name.demodulize.underscore.dasherize.pluralize
  end

  def self.descendants
    @_descendants ||= type_values.map { |t| t.to_s.constantize }
    super
  end

  def self.humanize
    name.demodulize.underscore.humanize.downcase
  end

  def valid_cast_roles
    self.class.valid_cast_roles(self.class)
  end

  def show?
    type == 'Show'
  end

  def workshop?
    type == 'Workshop'
  end

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
