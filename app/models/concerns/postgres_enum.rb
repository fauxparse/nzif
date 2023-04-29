class PostgresEnum
  attr_reader :name

  def self.[](name)
    @enums ||= {}
    @enums[name] ||= new(name:)
  end

  def values
    @values ||= fetch_values
  end

  private

  def initialize(name:)
    @name = name
  end

  def fetch_values
    ActiveRecord::Base.connection.execute(
      ActiveRecord::Base.sanitize_sql_array([
        <<~SQL.squish, name
          SELECT pg_enum.enumlabel AS value
          FROM pg_type
          JOIN pg_enum on pg_enum.enumtypid = pg_type.oid
          WHERE pg_type.typname = ?
        SQL
      ]),
    ).flat_map(&:values).map(&:to_sym)
  end

  module Helper
    extend ActiveSupport::Concern

    class_methods do
      def enum(name, enum_type = name)
        super(name, PostgresEnum[enum_type].values.index_with(&:to_s))

        define_singleton_method(:"#{name}_values") do
          PostgresEnum[enum_type].values
        end
      end
    end
  end
end
