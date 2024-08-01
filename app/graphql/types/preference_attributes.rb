module Types
  class PreferenceAttributes < BaseInputObject
    argument :position, Integer, required: true
    argument :session_id, ID, required: true
  end
end
