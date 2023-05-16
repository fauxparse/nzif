module Types
  class StringPreferenceType < BaseObject
    implements PreferenceType

    field :value, String, null: false
  end
end
