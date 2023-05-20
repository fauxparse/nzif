module Types
  class PermissionType < BaseEnum
    Permission.each do |name, permission|
      value name.to_s, permission.description, value: permission.name
    end
  end
end
