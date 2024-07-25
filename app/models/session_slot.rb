# rubocop:disable Rails/ApplicationRecord

class SessionSlot < ActiveRecord::Base
  is_view materialized: true
end

# rubocop:enable Rails/ApplicationRecord
