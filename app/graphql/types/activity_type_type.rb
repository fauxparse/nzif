module Types
  class ActivityTypeType < BaseEnum
    Activity.descendants.each do |activity|
      value activity.name, activity.name, value: activity
    end
  end
end
