# rubocop:disable Rails/ApplicationRecord

class Account < ActiveRecord::Base
  is_view

  self.primary_key = :id

  belongs_to :registration

  monetize :outstanding_cents
end

# rubocop:enable Rails/ApplicationRecord
