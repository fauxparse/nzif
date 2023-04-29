class Activity < ApplicationRecord
  include Sluggable
  include Searchable

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
end
