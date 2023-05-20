module Types
  class PermissionType < BaseEnum
    Permission.each do |name, permission|
      value name.to_s.camelize, permission.description, value: permission
    end
  end
end
