module Types
  class StringSettingType < BaseObject
    implements SettingType

    field :value, String, null: false
  end
end
