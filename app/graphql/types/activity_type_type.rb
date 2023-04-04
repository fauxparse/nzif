module Types
  class ActivityTypeType < BaseEnum
    description 'The state of a festival'

    value 'show', 'Show', value: ::Show
    value 'workshop', 'Workshop', value: ::Workshop
  end
end
