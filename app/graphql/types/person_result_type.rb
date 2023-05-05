module Types
  class PersonResultType < Types::BaseObject
    implements Types::SearchResultType

    description 'A search result from a person'

    field :person, PersonType, null: false, description: 'Person'

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
      "/people/#{person.to_param}"
    end

    delegate :person, to: :object
  end
end
