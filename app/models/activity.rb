class Activity < ApplicationRecord
  include ActivityPictureUploader::Attachment(:picture)
  include Sluggable
  include Searchable
  include Castable

  has_paper_trail

  enum :type, :activity_type

  sluggable scope: %i[festival_id type]

  belongs_to :festival
  has_many :sessions, inverse_of: :activity, dependent: :nullify
  has_many :slots, through: :sessions

  searchable_on :name, :description

  validates :booking_link,
    absence: { unless: :show? }
  validates :suitability,
    absence: { unless: :workshop? }

  scope :by_type, ->(type) { where(type: type.to_s) }

  after_save do
    next unless saved_change_to_picture_data?

    picture(:tiny)&.open do |io|
      image = MiniMagick::Image.open(io)
      width, height = image.dimensions
      pixels = image.get_pixels.flatten(1)
        .map { |r, g, b| (r * 65_536) + (g * 256) + b }
      update_attribute(:blurhash, Blurhash.encode(width, height, pixels)) # rubocop:disable Rails/SkipsModelValidations
    end
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
end
