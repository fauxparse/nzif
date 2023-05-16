module Types
  class ActivityAttributes < BaseInputObject
    argument :description, String, required: false
    argument :name, String, required: false
    argument :profile_ids, [ID], required: false
    argument :slug, String, required: false
  end
end
