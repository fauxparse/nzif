# rubocop:disable Rails/ApplicationRecord

class SlotSession < ActiveRecord::Base
  is_view

  belongs_to :slot
  belongs_to :session
end

# rubocop:enable Rails/ApplicationRecord
