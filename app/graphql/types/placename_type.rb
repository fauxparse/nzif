module Types
  class PlacenameType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :raw, String, null: false
    field :traditional_name, String, null: true

    def id
      placename.to_param || placename.english
    end

    def placename
      return object if object.is_a?(Placename)

      dataloader
        .with(Sources::Placenames, context:)
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
