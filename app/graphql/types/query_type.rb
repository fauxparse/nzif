module Types
  class QueryType < Types::BaseObject
    include Authorization

    field :festival, FestivalType, null: false do
      argument :year, String, required: false
    end

    field :user, UserType, null: true do
      argument :id, ID, required: false
    end

    field :preference, PreferenceType, null: true do
      argument :id, String, required: true
    end

    field :search, resolver: Resolvers::SearchQuery

    field :people, [PersonType]

    field :person, PersonType do
      argument :id, ID, required: true
    end

    def festival(year: nil)
      if year
        Festival.by_year(year).first!
      else
        Festival.where('end_date >= ?', Time.zone.today).first!
      end
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

    def people
      authorized_scope(Profile, type: :relation).all
    end
  end
end
