# rubocop:disable Rails/ApplicationRecord

class ActivityOwner < ActiveRecord::Base
  is_view

  belongs_to :activity
  belongs_to :user
end

# rubocop:enable Rails/ApplicationRecord
