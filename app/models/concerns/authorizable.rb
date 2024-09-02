module Authorizable
  extend ActiveSupport::Concern

  class_methods do
    def with_permission(permission)
      select("#{table_name}.*")
        .from(
          <<~SQL.squish,
            (
              SELECT
                #{table_name}.*,
                REPLACE(jsonb_array_elements(permissions)::text, '"', '') AS permission
              FROM #{table_name}
            ) AS #{table_name}
          SQL
        )
        .where(permission: Permission[permission].ancestors.map(&:to_sym))
        .uniq!(:id)
    end
  end

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
