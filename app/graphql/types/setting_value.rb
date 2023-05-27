module Types
  class SettingValue < BaseInputObject
    argument :boolean, Boolean, required: false
    argument :string, String, required: false
  end
end
