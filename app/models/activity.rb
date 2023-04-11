class Activity < ApplicationRecord
  include Sluggable
  include Searchable

  sluggable scope: %i[festival_id type]

  belongs_to :festival

  searchable_on :name, :description

  def self.to_param
    name.demodulize.underscore.dasherize.pluralize
  end
end
