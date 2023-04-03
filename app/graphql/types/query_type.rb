module Types
  class QueryType < Types::BaseObject
    description 'Top-level query interface'

    field :festival, Types::Festival, null: false do
      description 'Find a festival by year'
      argument :year, String, required: true, description: 'The year of the festival'
    end

    def festival(year:)
      ::Festival.by_year(year).first
    end
  end
end
