module Castable
  extend ActiveSupport::Concern

  module ClassMethods
    def roles(*role_names)
      @roles ||= superclass == ApplicationRecord ? [] : superclass.roles.dup

      role_names.each do |role_name|
        define_role(role_name) if @roles.exclude?(role_name.to_sym)
      end

      @roles
    end

    def define_role(role_name)
      @roles << role_name.to_sym

      has_many role_name.to_s.pluralize.to_sym, # rubocop:disable Rails/InverseOf
        -> { where(role: role_name.to_s).order(position: :asc) },
        class_name: 'Cast',
        as: :activity,
        autosave: true,
        dependent: :destroy
    end

    def valid_cast_roles(klass)
      if klass.ancestors.include?(Session)
        Castable.roles_from_config.values.flat_map { |c| c[:session] || [] }.map(&:to_sym)
      else
        Castable.roles_from_config[klass.name.demodulize.underscore.to_sym][:activity].map(&:to_sym)
      end
    end
  end

  def self.roles_from_config
    @roles_from_config ||= YAML.load_file(Rails.root.join('config/roles.yml'))
      .deep_symbolize_keys[:roles][:activities]
  end

  included do
    has_many :cast, as: :activity, dependent: :destroy, autosave: true, inverse_of: :activity

    def self.inherited(subclass)
      super
      subclass.roles(*valid_cast_roles(subclass))
    end
  end
end
