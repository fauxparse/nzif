module Types
  class PersonResultType < Types::BaseObject
    implements Types::SearchResultType

    field :person, PersonType, null: false

    def id
      "person[#{person.to_param}]"
    end

    def title
      person.name
    end

    def description
      ''
    end

    def url
      "/admin/people/#{person.to_param}"
    end

    delegate :person, to: :object
  end
end
