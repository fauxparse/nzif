class Activity < ApplicationRecord
  include Sluggable
  include PgSearch::Model

  sluggable scope: %i[festival_id type]

  belongs_to :festival

  pg_search_scope :search_activities,
    against: { name: 'A', description: 'B' },
    using: { tsearch: { dictionary: 'english', tsvector_column: 'searchable' } }

  def self.to_param
    name.demodulize.underscore.dasherize.pluralize
  end
end
