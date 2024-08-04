class Permission
  attr_reader :name, :description, :parent

  class << self
    include ::Enumerable

    def permissions
      load_permissions unless @permissions
      @permissions
    end

    def all
      permissions.values
    end

    delegate :each, :each_key, :[], to: :permissions

    private

    def load_permissions
      yaml = YAML.load_file(Rails.root.join('config/permissions.yml')).deep_symbolize_keys
      @permissions = ActiveSupport::HashWithIndifferentAccess.new
      yaml.each do |name, permission|
        define_permission(name:, **permission)
      end
    end

    def define_permission(name:, description:, implies: {}, parent: nil)
      @permissions[name] = new(name, description:, parent:).tap do |permission|
        implies.each do |child_name, child|
          define_permission(name: child_name, **child, parent: permission)
        end
      end
    end
  end

  def initialize(name, description:, parent: nil)
    @name = name.to_sym
    @description = description
    @parent = parent
  end

  def children
    self.class.permissions.values.select { |p| p.parent == self }
  end

  def include?(permission)
    name = permission.is_a?(Permission) ? permission.name : permission.to_sym
    self.name == name || children.any? { |p| p.include?(name) }
  end

  alias to_sym name

  delegate :to_s, to: :name

  class Set < ::Set
    def self.load(permissions)
      values = (permissions || []).map do |p|
        case p
        when Hash then p[:name] || p['name']
        else Permission[p.to_sym]
        end
      end
      new(values)
    end

    def self.dump(value)
      value.map(&:to_s)
    end

    def include?(permission)
      any? { |p| p.include?(permission) }
    end

    def <<(permission)
      super(Permission[permission.to_sym])
    end
  end
end
