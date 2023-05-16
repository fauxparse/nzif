module Types
  class BooleanPreferenceType < BaseObject
    implements PreferenceType

    field :value, Boolean, null: false
  end
end
