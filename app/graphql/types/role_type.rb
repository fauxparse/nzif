module Types
  class RoleType < BaseEnum
    Cast.all_roles.each do |role|
      value role.to_s, role.to_s, value: role
    end
  end
end
