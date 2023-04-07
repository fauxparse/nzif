module Types
  class PageResultType < Types::BaseObject
    implements Types::SearchResultType

    description 'A search result from a content page'

    field :slug, String, null: false, description: 'Slug of the page'
  end
end
