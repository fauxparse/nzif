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

  def self.all_roles
    @all_roles ||=
      YAML.load_file(Rails.root.join('config/roles.yml'))
        .deep_symbolize_keys[:roles][:activities]
        .values
        .flat_map(&:values)
        .flatten
        .map(&:to_sym)
        .uniq
  end

  all_roles.each do |role|
    define_method(:"#{role}?") { self.role == role }
  end

  private

  def valid_role
    return if !activity || activity.valid_cast_roles.include?(role.to_sym)

    errors.add(:role, "is not valid for a #{activity.class.name.humanize}")
  end
end
