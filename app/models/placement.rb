class Placement < ApplicationRecord
  belongs_to :registration
  belongs_to :session
end
