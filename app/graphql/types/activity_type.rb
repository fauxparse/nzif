module Types
  class ActivityType < BaseEnum
    description 'The state of a festival'

    value 'show', 'Show', value: ::Show
    value 'workshop', 'Workshop', value: ::Workshop

    graphql_name 'ActivityType'
  end
end
