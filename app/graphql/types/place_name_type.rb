module Types
  class PlaceNameType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :raw, String, null: false
    field :traditional_name, String, null: true

    def id
      placename.id || object
    end

    def placename
      dataloader
        .with(Sources::PlaceName, context:)
        .load(object)
    end

    def name
      placename.english
    end

    def traditional_name
      placename.traditional
    end

    def raw
      object
    end
  end
end
