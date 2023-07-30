class Placement < ApplicationRecord
  belongs_to :registration
  belongs_to :session
  has_one :workshop, through: :session, source: :activity, source_type: 'Workshop'
end
