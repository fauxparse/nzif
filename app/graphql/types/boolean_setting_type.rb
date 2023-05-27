module Types
  class BooleanSettingType < BaseObject
    implements SettingType

    field :value, Boolean, null: false
  end
end
