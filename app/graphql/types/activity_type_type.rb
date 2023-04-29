module Types
  class ActivityTypeType < BaseEnum
    description 'The state of a festival'

    Activity.descendants.each do |activity|
      value activity.name, activity.name, value: activity
    end
  end
end
