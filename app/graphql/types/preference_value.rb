module Types
  class PreferenceValue < BaseInputObject
    description 'Value for a user preference'

    argument :boolean, Boolean, required: false,
      description: 'The new value for the preference as a boolean'
    argument :string, String, required: false,
      description: 'The new value for the preference as a string'
  end
end
