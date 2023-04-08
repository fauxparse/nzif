module Types
  class ActivityTypeType < BaseEnum
    description 'The state of a festival'

    value 'Show', 'Show', value: ::Show
    value 'Workshop', 'Workshop', value: ::Workshop
  end
end
