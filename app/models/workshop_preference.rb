class WorkshopPreference < ApplicationRecord
  is_view

  belongs_to :session, foreign_key: :id # rubocop:disable Rails/InverseOf
end
