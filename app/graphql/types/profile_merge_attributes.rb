module Types
  class ProfileMergeAttributes < BaseInputObject
    argument :city, ID, required: false
    argument :country, ID, required: false
    argument :name, ID, required: false
    argument :pronouns, ID, required: false
  end
end
