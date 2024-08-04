module Authorizable
  extend ActiveSupport::Concern

  included do
    serialize :permissions, coder: Permission::Set

    Permission.each_key do |name|
      define_method :"#{name}?" do
        permission?(name)
      end
    end
  end

  def permission?(name)
    permissions.include?(name)
  end

  def permissions=(permissions)
    super(Permission::Set.load(permissions))
  end
end
