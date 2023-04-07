module Types
  class BooleanPreferenceType < BaseObject
    implements PreferenceType

    description 'A boolean user preference'

    field :value, Boolean, null: false, description: 'Preference value'
  end
end
