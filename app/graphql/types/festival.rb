module Types
  class Festival < Types::BaseObject
    description 'A festival'

    field :id, ID, null: false, description: 'Year of the festival'

    field :end_date, Types::ISODate, null: false, description: 'The last day of the festival'
    field :start_date, Types::ISODate, null: false, description: 'The first day of the festival'
    field :state, Types::FestivalState, null: false, description: 'State of the festival'

    def id
      object.start_date.year.to_s
    end
  end
end
