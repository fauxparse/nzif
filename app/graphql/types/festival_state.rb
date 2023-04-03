module Types
  class FestivalState < BaseEnum
    description 'The state of a festival'

    value 'upcoming', 'In the future', value: :upcoming
    value 'happening', 'Happening right now', value: :happening
    value 'finished', 'In the past', value: :finished
  end
end
