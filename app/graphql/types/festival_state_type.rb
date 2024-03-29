module Types
  class FestivalStateType < BaseEnum
    value 'Upcoming', 'In the future', value: :upcoming
    value 'Happening', 'Happening right now', value: :happening
    value 'Finished', 'In the past', value: :finished
  end
end
