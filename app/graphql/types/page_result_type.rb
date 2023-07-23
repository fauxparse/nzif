module Types
  class PageResultType < Types::BaseObject
    implements Types::SearchResultType

    field :lede, String, null: true
    field :slug, String, null: false
    field :title, String, null: false

    def id
      "page[#{object.slug}]"
    end

    def description
      object.lede
    end

    def url
      "/about/#{object.slug}"
    end
  end
end
