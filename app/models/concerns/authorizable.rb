module Authorizable
  extend ActiveSupport::Concern

  class RoleSet < Set
    def self.load(value)
      new(value&.map(&:to_sym) || [])
    end

    def self.dump(value)
      value.to_a
    end

    def <<(value)
      super(value.to_sym)
    end
  end

  class_methods do
    def roles
      PostgresEnum[:role_name].values
    end
  end

  included do
    roles.each do |name|
      define_method(:"#{name}?") { role?(name) }
    end

    serialize :roles, RoleSet
  end

  def role?(name)
    roles.include?(name)
  end
end
