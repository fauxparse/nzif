module Types
  class RoleType < BaseEnum
    description 'User authorization roles'

    Role.names.each_key do |name|
      value name.camelize, name.humanize, value: name.to_sym
    end
  end
end
