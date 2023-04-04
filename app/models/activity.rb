class Activity < ApplicationRecord
  include Sluggable

  sluggable scope: %i[festival_id type]

  belongs_to :festival
end
