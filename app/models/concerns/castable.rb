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
        class_name: 'Person',
        as: :activity,
        autosave: true,
        dependent: :destroy
    end

    def roles_from_config
      @roles_from_config ||= YAML.load_file(Rails.root.join('config/roles.yml'))
        .deep_symbolize_keys[:roles][:activities]
    end
  end

  included do
    def self.inherited(subclass)
      super
      config = roles_from_config[subclass.name.demodulize.underscore.to_sym] || {}
      subclass.roles(*config[:activity] || [])
    end
  end
end
