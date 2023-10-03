class Feedback < ApplicationRecord
  belongs_to :registration
  belongs_to :session

  validates :rating,
    numericality: {
      only_integer: true,
      in: 1..7,
      allow_blank: true,
    }
end
