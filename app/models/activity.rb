class Activity < ApplicationRecord
  include Sluggable
  include Searchable

  sluggable scope: %i[festival_id type]

  belongs_to :festival

  searchable_on :name, :description

  scope :by_type, ->(type) { where(type: type.to_s) }

  def self.to_param
    name.demodulize.underscore.dasherize.pluralize
  end

  def self.descendants
    @_descendants ||= Dir[Rails.root.join('app/models/activity/*.rb')].map do |file|
      File.basename(file, '.rb').classify.constantize
    end
    super
  end
end
