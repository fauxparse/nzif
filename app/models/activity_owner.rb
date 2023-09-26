# rubocop:disable Rails/ApplicationRecord

class ActivityOwner < ActiveRecord::Base
  is_view

  belongs_to :activity
  belongs_to :user, inverse_of: :activity_owners
end

# rubocop:enable Rails/ApplicationRecord
