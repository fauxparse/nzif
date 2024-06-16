module Types
  class QueryType < Types::BaseObject
    include Authorization

    field :festival, FestivalType, null: false, authenticate: false do
      argument :year, String, required: false
    end

    field :user, UserType, null: true, authenticate: false do
      argument :id, ID, required: false
    end

    field :setting, SettingType, null: true, authenticate: false do
      argument :id, String, required: true
    end

    field :search, resolver: Resolvers::SearchQuery, authenticate: false

    field :people, [PersonType], authenticate: false

    field :person, PersonType, authenticate: false do
      argument :id, ID, required: true
    end

    field :permissions, [PermissionDefinitionType], null: false, authenticate: false

    field :translations, resolver: Resolvers::Translations, authenticate: false

    field :registration, resolver: Resolvers::Registration, authenticate: false

    field :payment, PaymentType, null: false do
      argument :id, ID, required: true
    end

    field :directory_result, resolver: Resolvers::DirectoryResult, authenticate: false
    field :directory_search, resolver: Resolvers::DirectorySearch, authenticate: false

    field :cities, [CityType], null: false, authenticate: false

    field :calendar, [CalendarSessionType], null: false, authenticate: false

    def festival(year: nil)
      if year
        Festival.by_year(year).first!
      else
        Festival.current
      end
    end

    def user(id: nil)
      if id
        authorized_scope(User, type: :relation).find(id)
      else
        context[:current_resource]
      end
    end

    def setting(id:)
      pref = User.settings[id.underscore.to_sym]
      pref.to_graphql_object_for(user)
    end

    def people
      authorized_scope(Profile, type: :relation).all
    end

    def person(id:)
      # authorized_scope(Profile, type: :relation).find(id)
      Profile.find(id)
    end

    def permissions
      Permission.all.select { |p| p.parent.nil? }
    end

    def payment(id:)
      Payment.find(id)
    end

    def cities
      City.all
    end

    def calendar
      PersonalCalendar.new(festival: Festival.current, user: context[:current_resource]).sessions
    end
  end
end
