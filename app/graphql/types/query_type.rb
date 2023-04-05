module Types
  class QueryType < Types::BaseObject
    description 'Top-level query interface'

    field :festival, FestivalType, null: false do
      description 'Find a festival by year'
      argument :year, String, required: true, description: 'The year of the festival'
    end

    field :user, UserType, null: true, description: 'Current user'

    def festival(year:)
      Festival.by_year(year).first
    end

    def user
      context[:current_resource]
    end
  end
end
