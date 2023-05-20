module Types
  class PermissionDefinitionType < Types::BaseObject
    field :children, [PermissionDefinitionType], null: true
    field :id, PermissionType, null: false
    field :label, String, null: false, method: :description

    def id
      object.name.to_sym
    end
  end
end
