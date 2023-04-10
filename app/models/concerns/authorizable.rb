module Authorizable
  extend ActiveSupport::Concern

  included do
    has_many :roles, dependent: :destroy, autosave: true do
      def <<(role)
        case role
        when Symbol, String then super(Role.new(name: role))
        else super
        end
      end
    end

    Role.names.each_key do |name|
      define_method(:"#{name}?") { role?(name) }
    end
  end

  def role?(name)
    roles.exists?(name:)
  end

  def roles=(new_roles)
    new = Set.new(new_roles)
    existing = Set.new(roles.map(&:name))
    roles.each { |role| role.mark_for_destruction unless new.include?(role.name) }
    (new - existing).each { |role| roles.build(name: role) }
  end

  def role_names
    roles.map(&:name)
  end
end
