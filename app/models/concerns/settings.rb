module Settings
  extend ActiveSupport::Concern

  class Setting
    attr_reader :name, :type, :default, :description

    def initialize(name, type:, default:, description:)
      @name = name
      @type = type
      @default = default
      @description = description
    end

    def read_from(record)
      return default if record.blank? || !record.settings.key?(name.to_s)

      JSON.parse(record.settings[name.to_s])
    end

    def write_to(record, value)
      return if record.blank?

      record.settings[name.to_s] = value.to_json
    end

    def to_graphql_object_for(user)
      Hashie::Mash.new(
        id: name,
        type:,
        description:,
        value: read_from(user),
      )
    end
  end

  module ClassMethods
    def settings
      @settings ||= {}.with_indifferent_access.tap do |hash|
        hash.extend Hashie::Extensions::StrictKeyAccess
      end
    end

    def setting(name, **options)
      settings[name] = Setting.new(name, **options)

      define_method(name) { self.class.settings[name].read_from(self) }
      define_method(:"#{name}=") { |value| self.class.settings[name].write_to(self, value) }
    end
  end
end
