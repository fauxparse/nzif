module Types
  class SearchTypeType < BaseEnum
    description 'Type of object to search for'

    value 'Activity', 'Activity', value: :activity
    value 'Page', 'Page', value: :page
    value 'User', 'User', value: :user
    value 'Venue', 'Venue', value: :venue
  end
end
