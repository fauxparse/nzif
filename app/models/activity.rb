class Activity < ApplicationRecord
  include Sluggable
  include Searchable
  include Castable

  enum :type, :activity_type

  sluggable scope: %i[festival_id type]

  belongs_to :festival

  searchable_on :name, :description

  scope :by_type, ->(type) { where(type: type.to_s) }

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
