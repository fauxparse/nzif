module Types
  class PageResultType < Types::BaseObject
    implements Types::SearchResultType

    description 'A search result from a content page'

    field :lede, String, null: true, description: 'Lede of the page'
    field :slug, String, null: false, description: 'Slug of the page'
    field :title, String, null: false, description: 'Title of the page'

    def id
      "page[#{object.slug}]"
    end

    def description
      object.lede
    end

    def url
      "/#{object.slug}"
    end
  end
end
