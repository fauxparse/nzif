# rubocop:disable Rails/ApplicationRecord

class ProfileActivity < ActiveRecord::Base
  is_view

  belongs_to :activity, inverse_of: :profile_activities
  belongs_to :session, optional: true
  belongs_to :profile, inverse_of: :profile_activities

  def to_param
    [activity_id, session_id || 'all', profile_id, role].join('-')
  end

  def role
    super&.to_sym
  end
end

# rubocop:enable Rails/ApplicationRecord
