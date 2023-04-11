module Types
  class QueryType < Types::BaseObject
    include Authorization

    field :festival, FestivalType, null: false do
      description 'Find a festival by year'
      argument :year, String, required: true, description: 'The year of the festival'
    end

    field :user, UserType, null: true do
      description 'Current user'

      argument :id, ID, required: false,
        description: 'The ID of the user to retrieve (defaults to current user)'
    end

    field :preference, PreferenceType, null: true do
      description 'User preference (if set)'
      argument :id, String, required: true, description: 'The ID of the preference to retrieve'
    end

    field :search, resolver: Resolvers::SearchQuery, description: 'Search for content'

    def festival(year:)
      Festival.by_year(year).first
    end

    def user(id: nil)
      if id
        authorized_scope(User, type: :relation).find(id)
      else
        context[:current_resource]
      end
    end

    def preference(id:)
      pref = User.preferences[id.underscore.to_sym]
      pref.to_graphql_object_for(user)
    end
  end
end
