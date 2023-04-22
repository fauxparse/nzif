class Activity < ApplicationRecord
  include Sluggable
  include Searchable

  sluggable scope: %i[festival_id type]

  belongs_to :festival

  searchable_on :name, :description

  def self.to_param
    name.demodulize.underscore.dasherize.pluralize
  end

  def self.descendants
    Dir[Rails.root.join('app/models/activities/*.rb')].map do |file|
      require_once file
    end
    super
  end
end
