module Types
  class PreferenceValue < BaseInputObject
    argument :boolean, Boolean, required: false
    argument :string, String, required: false
  end
end
