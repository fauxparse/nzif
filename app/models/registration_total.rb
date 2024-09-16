class RegistrationTotal < ActiveRecord::Base # rubocop:disable Rails/ApplicationRecord
  is_view

  self.primary_key = :registration_id

  belongs_to :registration
  belongs_to :festival
end
