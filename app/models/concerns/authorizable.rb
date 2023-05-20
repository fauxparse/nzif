module Authorizable
  extend ActiveSupport::Concern

  included do
    serialize :permissions, Permission::Set

    Permission.each do |name, _permission|
      define_method :"#{name}?" do
        permission?(name)
      end
    end
  end

  def permission?(name)
    permissions.include?(name)
  end

  def permissions=(permissions)
    super(Permission::Set.new(permissions))
  end
end
