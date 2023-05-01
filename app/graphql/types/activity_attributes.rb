module Types
  class ActivityAttributes < BaseInputObject
    description 'Attributes for adding or updating an activity'

    argument :name, String, required: false,
      description: 'The name of the activity'
    argument :slug, String, required: false,
      description: 'The short name of the activity, used in the URL'
  end
end
