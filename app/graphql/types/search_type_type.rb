module Types
  class SearchTypeType < BaseEnum
    description 'Type of object to search for'

    value 'Activity', 'Activity', value: :activity
    value 'Page', 'Page', value: :page
    value 'Person', 'Person', value: :person
    value 'Venue', 'Venue', value: :venue
  end
end
