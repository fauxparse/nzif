# rubocop:disable Rails/ApplicationRecord

class ActivityOwner < ActiveRecord::Base
  is_view

  belongs_to :activity, polymorphic: true
  belongs_to :user, inverse_of: :activity_owners
  belongs_to :session
end

# rubocop:enable Rails/ApplicationRecord
