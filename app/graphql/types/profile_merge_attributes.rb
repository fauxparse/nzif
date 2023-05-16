# rubocop:disable GraphQL/ArgumentDescription

module Types
  class ProfileMergeAttributes < BaseInputObject
    description 'Attributes for merging profiles'

    argument :city, ID, required: false
    argument :country, ID, required: false
    argument :name, ID, required: false
    argument :pronouns, ID, required: false
  end
end

# rubocop:enable GraphQL/ArgumentDescription
