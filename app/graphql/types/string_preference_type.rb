module Types
  class StringPreferenceType < BaseObject
    implements PreferenceType

    description 'A string user preference'

    field :value, String, null: false, description: 'Preference value'
  end
end
