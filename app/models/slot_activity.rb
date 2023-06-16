# rubocop:disable Rails/ApplicationRecord

class SlotActivity < ActiveRecord::Base
  is_view

  belongs_to :slot
  belongs_to :activity
  belongs_to :session
end

# rubocop:enable Rails/ApplicationRecord
