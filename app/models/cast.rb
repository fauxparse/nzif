class Cast < ApplicationRecord
  belongs_to :activity, polymorphic: true
  belongs_to :profile

  validates :role, presence: true
  validate :valid_role, if: :role?

  acts_as_list scope: %i[activity_id role], top_of_list: 0

  default_scope { order(position: :asc) }

  def role
    super.to_sym
  end

  private

  def valid_role
    return if !activity || activity.valid_cast_roles.include?(role.to_sym)

    errors.add(:role, "is not valid for a #{activity.class.humanize}")
  end
end
