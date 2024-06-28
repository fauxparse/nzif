class ProfilePolicy < ApplicationPolicy
  def index?
    user.people? || user.activities.exists?
  end

  def show?
    index? || (user.id == record&.user_id)
  end

  def create?
    true
  end

  def update?
    user.people? || (user.id == record.user_id)
  end

  scope_for :relation do |relation|
    next relation if user.admin? || user.activities.exists?

    # Only list presenters if you're not an admin
    relation
      .joins('LEFT OUTER JOIN "cast" ON "cast"."profile_id" = "profiles"."id"')
      .group('"profiles"."id"')
      .having('COUNT("cast"."id") > 0')
  end

  scope_for :data, :attributes do |data, with_record: nil|
    next data if user.people? && user.id != with_record&.user_id

    data.except(:roles)
  end
end
