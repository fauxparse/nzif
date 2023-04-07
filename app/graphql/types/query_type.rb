module Types
  class QueryType < Types::BaseObject
    description 'Top-level query interface'

    field :festival, FestivalType, null: false do
      description 'Find a festival by year'
      argument :year, String, required: true, description: 'The year of the festival'
    end

    field :user, UserType, null: true do
      description 'Current user'
    end

    field :preference, PreferenceType, null: true do
      description 'User preference (if set)'
      argument :id, String, required: true, description: 'The ID of the preference to retrieve'
    end

    def festival(year:)
      Festival.by_year(year).first
    end

    def user
      context[:current_resource]
    end

    def preference(id:)
      pref = User.preferences[id.underscore.to_sym]
      pref.to_graphql_object_for(user)
    end
  end
end
